import React, { FC, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, Platform, TextStyle, ViewStyle } from "react-native"
import { useQuery } from "@tanstack/react-query"
import {
  PaymentIntent,
  Reader,
  StripeTerminalProvider,
  useStripeTerminal,
  requestNeededAndroidPermissions,
} from "@stripe/stripe-terminal-react-native"

import { Button, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"

export const DemoCollectPaymentScreen: FC<DemoTabScreenProps<"DemoCollectPayment">> = (_props) => {
  const terminalTokenQuery = useQuery({
    queryKey: ["terminalToken"],
    queryFn: async () => {
      const domain = Platform.OS === "android" && __DEV__ ? "10.0.2.2" : "192.168.4.20"
      try {
        const response = await fetch(`http://${domain}:3000/connection_token`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        const data = (await response.json()) as { secret: string }
        return data
      } catch (error) {
        Alert.alert("Error", JSON.stringify(error))
        throw error
      }
    },
  })
  const [terminalReady, setTerminalReady] = useState(false)

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      {terminalTokenQuery.data === undefined ? (
        <>
          <Text preset="heading" tx="demoCollectPaymentScreen.title" style={$title} />
          <Text tx="demoCollectPaymentScreen.settingUpPaymentTerminal" style={$tagline} />
          <ActivityIndicator size={"large"} />
        </>
      ) : (
        <StripeTerminalProvider
          logLevel="verbose"
          tokenProvider={async () => terminalTokenQuery.data.secret}
        >
          {terminalReady ? (
            <CollectPayment />
          ) : (
            <SetupTerminal onConnected={() => setTerminalReady(true)} />
          )}
        </StripeTerminalProvider>
      )}
    </Screen>
  )
}

const SetupTerminal = (props: { onConnected: () => void }) => {
  const [sdkInitialized, setSdkInitialized] = useState(false)

  const [terminalConnected, setTerminalConnected] = useState(false)
  const scanningForBluetoothReader = useRef(false)
  const connectingToBluetoothReader = useRef(false)

  const stripeTerminal = useStripeTerminal()

  useEffect(() => {
    async function initializeStripe() {
      if (Platform.OS === "android") {
        const { error: androidPermissionsError } = await requestNeededAndroidPermissions({
          accessFineLocation: {
            title: "Location Permission",
            message: "Stripe Terminal needs access to your location",
            buttonPositive: "Accept",
          },
        })

        if (androidPermissionsError) {
          console.error("Something went wrong retrieving Android permissions")
          return
        }
      }

      console.log("initializing Stripe!")
      const initResult = await stripeTerminal.initialize()

      if (initResult.error) {
        console.error("Something went wrong initializing Stripe")
        return
      }

      if (initResult.reader) {
        console.log("Already connected to reader at initialization", initResult.reader)
        setTerminalConnected(true)
      }

      setSdkInitialized(true)
    }

    if (!sdkInitialized) {
      initializeStripe()
    }
  }, [sdkInitialized, stripeTerminal.initialize, stripeTerminal.disconnectReader])

  useEffect(() => {
    async function discoverBluetoothReader() {
      console.log("discovering bluetooth readers")
      const discoverResult = await stripeTerminal.discoverReaders({
        discoveryMethod: "bluetoothScan",
        simulated: true,
      })
      if (discoverResult.error) {
        console.error("Something went wrong discovering bluetooth readers", discoverResult.error)
      }
    }

    if (sdkInitialized && !terminalConnected && !scanningForBluetoothReader.current) {
      scanningForBluetoothReader.current = true
      discoverBluetoothReader()
    }
  }, [sdkInitialized, terminalConnected, stripeTerminal.discoverReaders])

  useEffect(() => {
    async function connectToBluetoothReader(reader: Reader.Type) {
      console.log("connecting to bluetooth reader")
      const connectResult = await stripeTerminal.connectBluetoothReader({
        reader,
        locationId: reader.locationId,
      })
      if (connectResult.error) {
        console.error("Something went wrong connecting to bluetooth reader", connectResult.error)
        return
      }

      console.log("Connected to bluetooth reader", connectResult.reader)

      await stripeTerminal.setSimulatedCard("4242424242424242")

      setTerminalConnected(true)
      scanningForBluetoothReader.current = false
      connectingToBluetoothReader.current = false
    }

    if (
      sdkInitialized &&
      !terminalConnected &&
      stripeTerminal.discoveredReaders.length > 0 &&
      !connectingToBluetoothReader.current
    ) {
      connectingToBluetoothReader.current = true
      connectToBluetoothReader(stripeTerminal.discoveredReaders[0])
    }
  }, [
    sdkInitialized,
    terminalConnected,
    stripeTerminal.discoveredReaders,
    stripeTerminal.connectLocalMobileReader,
    stripeTerminal.setSimulatedCard,
  ])

  useEffect(() => {
    if (terminalConnected) {
      props.onConnected()
    }
  }, [terminalConnected])

  return (
    <>
      <Text preset="heading" tx="demoCollectPaymentScreen.title" style={$title} />
      <Text tx="demoCollectPaymentScreen.settingUpPaymentTerminal" style={$tagline} />
      <ActivityIndicator size={"large"} color="blue" />
    </>
  )
}

const CollectPayment = () => {
  const stripeTerminal = useStripeTerminal()

  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent.Type | undefined>()
  const [isAnotherTransaction, setIsAnotherTransaction] = useState(false)

  const [paymentCollected, setPaymentCollected] = useState(false)
  const collectingPayment = useRef(false)

  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const confirmingPayment = useRef(false)

  function reset() {
    setIsAnotherTransaction(true)
    setPaymentIntent(undefined)
    setPaymentCollected(false)
    setPaymentConfirmed(false)
  }

  async function createPaymentIntent() {
    if (paymentConfirmed) {
      reset()
    }

    const paymentIntentResponse = await stripeTerminal.createPaymentIntent({
      amount: 500,
      currency: "usd",
      offlineBehavior: "require_online",
      paymentMethodTypes: ["card_present"],
      captureMethod: "automatic",
    })

    if (paymentIntentResponse.error) {
      console.error("Something went wrong creating payment intent")
      return
    }

    console.log("Created payment intent", paymentIntentResponse.paymentIntent.id)
    setPaymentIntent(paymentIntentResponse.paymentIntent)
  }

  useEffect(() => {
    async function collectPayment(paymentIntentResult: PaymentIntent.Type) {
      const collectPaymentResponse = await stripeTerminal.collectPaymentMethod({
        paymentIntent: paymentIntentResult,
      })

      if (collectPaymentResponse.error) {
        console.error("Something went wrong collecting payment")
        return
      }

      console.log("Collected payment for ", collectPaymentResponse.paymentIntent.amount)
      setPaymentCollected(true)
      collectingPayment.current = false
    }

    if (paymentIntent && !paymentCollected && !collectingPayment.current) {
      collectingPayment.current = true
      collectPayment(paymentIntent)
    }
  }, [paymentIntent, paymentCollected, stripeTerminal.collectPaymentMethod])

  useEffect(() => {
    async function confirmPayment(paymentIntentResult: PaymentIntent.Type) {
      const confirmPaymentResponse = await stripeTerminal.confirmPaymentIntent(paymentIntentResult)

      if (confirmPaymentResponse.error) {
        console.error("Something went wrong confirming payment")
        return
      }

      console.log("Confirming payment for ", confirmPaymentResponse.paymentIntent.id)
      setPaymentConfirmed(true)
      confirmingPayment.current = false
    }

    if (paymentIntent && paymentCollected && !paymentConfirmed && !confirmingPayment.current) {
      confirmingPayment.current = true
      confirmPayment(paymentIntent)
    }
  }, [paymentIntent, paymentCollected, paymentConfirmed, stripeTerminal.confirmPaymentIntent])

  return paymentIntent || isAnotherTransaction ? (
    paymentCollected ? (
      paymentConfirmed ? (
        <>
          <Text preset="heading" tx="demoCollectPaymentScreen.thankYou" style={$title} />
          <Button
            style={$button}
            tx="demoCollectPaymentScreen.startAnotherTransaction"
            onPress={createPaymentIntent}
          />
        </>
      ) : (
        <>
          <Text
            preset="heading"
            tx="demoCollectPaymentScreen.placeYourCardOnTheCardReader"
            style={$title}
          />
          <ActivityIndicator size={"large"} color="red" />
        </>
      )
    ) : (
      <>
        <Text
          preset="heading"
          tx="demoCollectPaymentScreen.placeYourCardOnTheCardReader"
          style={$title}
        />
        <ActivityIndicator size={"large"} color="orange" />
      </>
    )
  ) : (
    <>
      <Text preset="heading" tx="demoCollectPaymentScreen.title" style={$title} />
      <Text tx="demoCollectPaymentScreen.startNewTransaction" style={$tagline} />
      <Button style={$button} tx="common.go" onPress={createPaymentIntent} />
    </>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.xxl,
}

const $tagline: TextStyle = {
  textAlign: "center",
  marginBottom: spacing.md,
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
}

// @demo remove-file
