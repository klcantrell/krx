import React, { useEffect } from "react"
import type { FC, PropsWithChildren } from "react"

import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

interface SortableItemProps {
  onChange: () => void
  offsets: SharedValue<{ y: number }[]>
  index: number
  activeCard: SharedValue<number | null>
  width: number
  height: number
}

export const SortableItem: FC<PropsWithChildren<SortableItemProps>> = ({
  onChange,
  children,
  offsets,
  width,
  height,
  index,
  activeCard,
}) => {
  const isGestureActive = useSharedValue(false)

  const offset = offsets.value[index] ?? { y: 0 }
  const x = useSharedValue(0)
  const y = useSharedValue(offset.y)

  useEffect(() => {
    y.value = offset.y
  }, [offset.y, y])

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetY: number }
  >({
    onStart: (_event, context) => {
      context.offsetY = y.value
      activeCard.value = index
      isGestureActive.value = true
    },
    onActive: (event, context) => {
      x.value = event.translationX
      y.value = context.offsetY + event.translationY

      const normalizedOffsetY = Math.round(y.value / height) * height
      for (let i = 0; i < offsets.value.length; i += 1) {
        const originalOffset = offsets.value[i].y
        if (originalOffset === normalizedOffsetY && i !== index) {
          offsets.value = offsets.value.map((o, j) => {
            if (j !== i && j !== index) {
              return o
            } else {
              if (j === i) {
                return {
                  y: offset.y,
                }
              } else {
                return {
                  y: originalOffset,
                }
              }
            }
          })

          runOnJS(onChange)()

          break
        }
      }
    },
    onEnd: () => {
      isGestureActive.value = false
      x.value = withSpring(0)
      y.value = withSpring(offset.y)
    },
  })

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return y.value
    } else {
      return withSpring(offset.y)
    }
  })

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: index === activeCard.value ? 100 : 0,
    transform: [
      { translateY: translateY.value },
      { translateX: x.value },
      { scale: withSpring(isGestureActive.value ? 1.1 : 1) },
    ],
  }))

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  )
}
