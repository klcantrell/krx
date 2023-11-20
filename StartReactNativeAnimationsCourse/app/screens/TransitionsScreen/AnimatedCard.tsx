import React from "react"
import { StyleSheet, Dimensions } from "react-native"
import Animated from "react-native-reanimated"

import type { Cards } from "app/components/animated"
import { Card, StyleGuide } from "app/components/animated"

const { width } = Dimensions.get("window")
const origin = -(width / 2 - StyleGuide.spacing * 2)
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: StyleGuide.spacing * 4,
  },
})

interface AnimatedCardProps {
  toggled: boolean
  index: number
  card: Cards
}

export const AnimatedCard = ({ card, toggled, index }: AnimatedCardProps) => {
  const alpha = toggled ? ((index - 1) * Math.PI) / 6 : 0
  const style = {
    transform: [{ translateX: origin }, { rotate: `${alpha}rad` }, { translateX: -origin }],
  }
  return (
    <Animated.View key={card} style={[styles.overlay, style]}>
      <Card {...{ card }} />
    </Animated.View>
  )
}
