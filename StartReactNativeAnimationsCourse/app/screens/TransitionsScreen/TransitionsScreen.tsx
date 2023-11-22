import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

import { Button, StyleGuide, cards } from "app/components/animated"
import { AnimatedCard } from "./AnimatedCard"
import { useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated"

const styles = StyleSheet.create({
  container: {
    backgroundColor: StyleGuide.palette.background,
    flex: 1,
    justifyContent: "flex-end",
  },
})

interface TransitionsScreenProps extends AppStackScreenProps<"Transitions"> {}

export const TransitionsScreen: FC<TransitionsScreenProps> = observer(function TransitionsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [toggled, setToggle] = useState(false)
  const isToggled = useSharedValue(0)

  useEffect(() => {
    isToggled.value = toggled ? 1 : 0
  }, [toggled, isToggled])

  const transition = useDerivedValue(() => {
    return withSpring(isToggled.value)
  })

  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => (
        <AnimatedCard key={card} index={index} card={card} transition={transition} />
      ))}
      <Button
        label={toggled ? "Reset" : "Start"}
        primary
        onPress={() => setToggle((prev) => !prev)}
      />
    </View>
  )
})
