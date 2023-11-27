import React from "react"
import Animated, {
  useAnimatedGestureHandler,
  withDecay,
  clamp,
  SharedValue,
} from "react-native-reanimated"
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import { PanGestureHandler } from "react-native-gesture-handler"

import { Card, Cards, CARD_WIDTH, CARD_HEIGHT } from "app/components/animated"
import { useTranslate } from "app/components/animated/AnimatedHelpers"
import { withBouncing } from "react-native-redash"

interface DraggableCardProps {
  translate: {
    x: SharedValue<number>
    y: SharedValue<number>
  }
  width: number
  height: number
}

export const DraggableCard = ({ translate, width, height }: DraggableCardProps) => {
  const boundX = width - CARD_WIDTH
  const boundY = height - CARD_HEIGHT
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offsetX: number
      offsetY: number
    }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translate.x.value
      ctx.offsetY = translate.y.value
    },
    onActive: (event, ctx) => {
      translate.x.value = clamp(ctx.offsetX + event.translationX, 0, boundX)
      translate.y.value = clamp(ctx.offsetY + event.translationY, 0, boundY)
    },
    onEnd: ({ velocityX, velocityY }) => {
      translate.x.value = withBouncing(
        withDecay({
          velocity: velocityX,
        }),
        0,
        boundX,
      )
      translate.y.value = withBouncing(
        withDecay({
          velocity: velocityY,
        }),
        0,
        boundY,
      )
    },
  })
  const style = useTranslate(translate)
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={style}>
        <Card card={Cards.Card1} />
      </Animated.View>
    </PanGestureHandler>
  )
}
