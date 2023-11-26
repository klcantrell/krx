import React, { Ref, forwardRef, useImperativeHandle } from "react"

import type { ProfileModel } from "./Profile"
import { A, Profile } from "./Profile"
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { Dimensions, StyleSheet } from "react-native"
import { snapPoint } from "react-native-redash"

interface SwipeableProps {
  onSwipe: () => void
  profile: ProfileModel
  onTop: boolean
  scale: SharedValue<number>
}

export interface SwipeableRef {
  swipeLeft: () => void
  swipeRight: () => void
}

const snapPoints = [-A, 0, A]
const { width } = Dimensions.get("window")

const swipe = (
  translateX: SharedValue<number>,
  scale: SharedValue<number>,
  destination: number,
  velocity: number,
  cb: () => void,
) => {
  "worklet"

  translateX.value = withSpring(
    destination,
    {
      velocity,
      overshootClamping: destination === 0,
      restSpeedThreshold: destination === 0 ? 0.01 : 100,
      restDisplacementThreshold: destination === 0 ? 0.01 : 100,
    },
    () => {
      if (destination !== 0) {
        runOnJS(cb)()
      }
    },
  )

  scale.value = withTiming(destination === 0 ? 0.95 : 1)
}

export const Swipeable = forwardRef(
  ({ profile, onTop, onSwipe, scale }: SwipeableProps, ref: Ref<SwipeableRef>) => {
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    useImperativeHandle(ref, () => {
      return {
        swipeLeft: () => {
          scale.value = 0.95
          swipe(translateX, scale, -A, 25, onSwipe)
        },
        swipeRight: () => {
          scale.value = 0.95
          swipe(translateX, scale, A, 25, onSwipe)
        },
      }
    })

    const onGestureEvent = useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      { offsetX: number; offsetY: number }
    >({
      onStart: (_event, context) => {
        context.offsetX = translateX.value
        context.offsetY = translateY.value
      },
      onActive: (event, context) => {
        translateX.value = event.translationX + context.offsetX
        translateY.value = event.translationY + context.offsetY
        scale.value = interpolate(
          translateX.value,
          [-width / 4, 0, width / 4],
          [1, 0.95, 1],
          Extrapolate.CLAMP,
        )
      },
      onEnd: ({ velocityX, velocityY }) => {
        const destination = snapPoint(translateX.value, velocityX, snapPoints)
        swipe(translateX, scale, destination, 5, onSwipe)
        translateY.value = withSpring(0, { velocity: velocityY })
      },
    })

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Profile
            profile={profile}
            onTop={onTop}
            translateX={translateX}
            translateY={translateY}
            scale={scale}
          />
        </Animated.View>
      </PanGestureHandler>
    )
  },
)

Swipeable.displayName = "Swipeable"
