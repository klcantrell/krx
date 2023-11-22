import React from "react"
import { StyleSheet, Dimensions } from "react-native"
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated"

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
  transition: SharedValue<number>
  index: number
  card: Cards
}

export const AnimatedCard = ({ card, transition, index }: AnimatedCardProps) => {
  const style = useAnimatedStyle(() => {
    const rotate = interpolate(transition.value, [0, 1], [0, ((index - 1) * Math.PI) / 6])
    return {
      transform: [{ translateX: origin }, { rotate: `${rotate}rad` }, { translateX: -origin }],
    }
  })
  return (
    <Animated.View key={card} style={[styles.overlay, style]}>
      <Card card={card} />
    </Animated.View>
  )
}
