import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, LayoutRectangle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

import { CARD_HEIGHT, CARD_WIDTH, Card, Cards } from "app/components/animated"
import { PanGestureHandlerGestureEvent, PanGestureHandler } from "react-native-gesture-handler"
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import { clamp } from "react-native-redash"
import { withBounce, withDecay } from "app/utils/animation"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

interface GestureProps {
  width: number
  height: number
}

interface PanGestureScreenProps extends AppStackScreenProps<"PanGesture"> {}

const PanGesture: FC<GestureProps> = ({ width, height }) => {
  const boundX = width - CARD_WIDTH
  const boundY = height - CARD_HEIGHT
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number; offsetY: number }
  >({
    onStart: (_event, context) => {
      // remember the last position we left the card at
      // add it to the context so that we can use it in onActive
      context.offsetX = translateX.value
      context.offsetY = translateY.value
    },
    onActive: (event, context) => {
      translateX.value = clamp(context.offsetX + event.translationX, 0, boundX)
      translateY.value = clamp(context.offsetY + event.translationY, 0, boundY)
    },
    onEnd: (event) => {
      translateX.value = withBounce(withDecay(event.velocityX), 0, boundX) as unknown as number
      translateY.value = withBounce(withDecay(event.velocityY), 0, boundY) as unknown as number
    },
  })
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }
  })

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={style}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export const PanGestureScreen: FC<PanGestureScreenProps> = observer(function PanGestureScreen() {
  const [container, setContainer] = useState<LayoutRectangle | null>(null)
  return (
    <View style={styles.container} onLayout={({ nativeEvent: { layout } }) => setContainer(layout)}>
      {container && <PanGesture {...container} />}
    </View>
  )
})
