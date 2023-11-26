import React from "react"

import { View, StyleSheet } from "react-native"

import { StyleGuide } from "app/components/animated"
import type { DataPoint } from "./GraphScreen"
import { ReText, round } from "react-native-redash"
import { SharedValue, useDerivedValue } from "react-native-reanimated"

const styles = StyleSheet.create({
  date: {
    ...StyleGuide.typography.title3,
    textAlign: "center",
  },
  price: {
    ...StyleGuide.typography.title2,
    textAlign: "center",
  },
})

interface LabelProps {
  point: SharedValue<DataPoint>
}

export const Label = ({ point }: LabelProps) => {
  const date = useDerivedValue(() => {
    return new Date(point.value.data.x).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })

  const price = useDerivedValue(() => {
    return `$${round(point.value.data.y, 2).toLocaleString("en-US", { currency: "USD" })}`
  })

  return (
    <View>
      <ReText style={styles.date} text={date} />
      <ReText style={styles.price} text={price} />
    </View>
  )
}
