import * as React from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import type Animated from "react-native-reanimated"

import { Bubble } from "./Bubble"

const { width: wWidth } = Dimensions.get("window")
const width = wWidth * 0.8
const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    borderBottomLeftRadius: width / 2,
    borderTopLeftRadius: width / 2,
    borderTopRightRadius: width / 2,
    flexDirection: "row",
    height: width,
    justifyContent: "space-evenly",
    width,
  },
  root: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
})

interface ChatBubbleProps {
  progress: Animated.SharedValue<number>
}

export const ChatBubble = ({ progress }: ChatBubbleProps) => {
  const bubbles = [0, 1, 2]
  const delta = 1 / bubbles.length
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {bubbles.map((i) => {
          const start = i * delta
          const end = start + delta
          return <Bubble key={i} {...{ start, end, progress }} />
        })}
      </View>
    </View>
  )
}