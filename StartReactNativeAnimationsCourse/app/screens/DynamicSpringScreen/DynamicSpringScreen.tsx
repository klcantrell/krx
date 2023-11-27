import React, { useState } from "react"
import type { FC } from "react"
import { View, StyleSheet, LayoutRectangle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { observer } from "mobx-react-lite"

import { Card, Cards, CARD_WIDTH, CARD_HEIGHT } from "app/components/animated"

import { DraggableCard } from "./DraggableCard"
import { AppStackScreenProps } from "app/navigators"

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    left: 0,
    position: "absolute",
    top: 0,
    width: CARD_WIDTH,
  },
  container: {
    flex: 1,
  },
})

interface DynamicSpringContentProps {
  width: number
  height: number
}

const DynamicSpringContent: FC<DynamicSpringContentProps> = ({ width, height }) => {
  const t1 = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  }
  const t2 = {
    x: useDerivedValue(() => withSpring(t1.x.value)),
    y: useDerivedValue(() => withSpring(t1.y.value)),
  }
  const t3 = {
    x: useDerivedValue(() => withSpring(t2.x.value)),
    y: useDerivedValue(() => withSpring(t2.y.value)),
  }

  const styleCard2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: t2.x.value }, { translateY: t2.y.value }],
    }
  })
  const styleCard3 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: t3.x.value }, { translateY: t3.y.value }],
    }
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, styleCard3]}>
        <Card card={Cards.Card3} />
      </Animated.View>
      <Animated.View style={[styles.card, styleCard2]}>
        <Card card={Cards.Card2} />
      </Animated.View>
      <DraggableCard translate={t1} width={width} height={height} />
    </View>
  )
}

interface DynamicSpringScreenProps extends AppStackScreenProps<"DynamicSpring"> {
  width: number
  height: number
}

export const DynamicSpringScreen: FC<DynamicSpringScreenProps> = observer(
  function PanGestureScreen() {
    const [container, setContainer] = useState<LayoutRectangle | null>(null)
    return (
      <View
        style={styles.container}
        onLayout={({ nativeEvent: { layout } }) => setContainer(layout)}
      >
        {container && <DynamicSpringContent {...container} />}
      </View>
    )
  },
)
