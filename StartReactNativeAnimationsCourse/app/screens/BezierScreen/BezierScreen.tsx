import React, { FC } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import Animated, { useAnimatedProps, useSharedValue } from "react-native-reanimated"
import { observer } from "mobx-react-lite"
import Svg, { Line, Path, Circle } from "react-native-svg"
import { addCurve, createPath, serialize } from "react-native-redash"

import { AppStackScreenProps } from "app/navigators"

import { ControlPoint, CONTROL_POINT_RADIUS } from "./ControlPoint"

const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedLine = Animated.createAnimatedComponent(Line)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const { width } = Dimensions.get("window")
const PADDING = 24
const SIZE = width
const STROKE_WIDTH = 4
const min = PADDING
const max = SIZE - PADDING
const start = {
  x: min,
  y: max,
}
const end = {
  x: max,
  y: min,
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  content: {
    height: SIZE + STROKE_WIDTH,
    width: SIZE + STROKE_WIDTH,
  },
})

interface BezierScreenProps extends AppStackScreenProps<"Bezier"> {}

export const BezierScreen: FC<BezierScreenProps> = observer(function BezierScreen() {
  const c1x = useSharedValue(min)
  const c1y = useSharedValue(min)
  const c2x = useSharedValue(max)
  const c2y = useSharedValue(max)

  const path = useAnimatedProps(() => {
    const curve = createPath({ x: start.x, y: start.y })
    addCurve(curve, {
      c1: {
        x: c1x.value,
        y: c1y.value,
      },
      c2: {
        x: c2x.value,
        y: c2y.value,
      },
      to: { x: end.x, y: end.y },
    })

    return {
      d: serialize(curve),
    }
  })
  const line1 = useAnimatedProps(() => ({
    x2: c1x.value,
    y2: c1y.value,
  }))
  const line2 = useAnimatedProps(() => ({
    x2: c2x.value,
    y2: c2y.value,
  }))
  const circle1 = useAnimatedProps(() => ({
    cx: c1x.value,
    cy: c1y.value,
  }))
  const circle2 = useAnimatedProps(() => ({
    cx: c2x.value,
    cy: c2y.value,
  }))

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Svg style={StyleSheet.absoluteFill}>
          <AnimatedPath
            fill="transparent"
            stroke="black"
            strokeWidth={STROKE_WIDTH}
            animatedProps={path}
          />
          <AnimatedLine
            x1={start.x}
            y1={start.y}
            stroke="black"
            strokeWidth={STROKE_WIDTH / 2}
            animatedProps={line1}
          />
          <AnimatedLine
            x1={end.x}
            y1={end.y}
            animatedProps={line2}
            stroke="black"
            strokeWidth={STROKE_WIDTH / 2}
          />
          <AnimatedCircle
            animatedProps={circle1}
            fill="#38ffb3"
            stroke="black"
            strokeWidth={STROKE_WIDTH}
            r={CONTROL_POINT_RADIUS}
          />
          <AnimatedCircle
            animatedProps={circle2}
            fill="#FF6584"
            stroke="black"
            strokeWidth={STROKE_WIDTH}
            r={CONTROL_POINT_RADIUS}
          />
        </Svg>
        <ControlPoint x={c1x} y={c1y} min={min} max={max} />
        <ControlPoint x={c2x} y={c2y} min={min} max={max} />
      </View>
    </View>
  )
})
