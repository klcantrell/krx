import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Easing, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"
import { withPause } from "react-native-redash"
import { ChatBubble } from "./ChatBubble"
import { Button, StyleGuide } from "app/components/animated"

interface AnimationsScreenProps extends AppStackScreenProps<"Animations"> {}

const easing = Easing.inOut(Easing.ease)
const styles = StyleSheet.create({
  container: {
    backgroundColor: StyleGuide.palette.background,
    flex: 1,
    justifyContent: "space-between",
  },
})

export const AnimationsScreen: FC<AnimationsScreenProps> = observer(function AnimationsScreen() {
  const [play, setPlay] = useState(false)
  const paused = useSharedValue(!play)
  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withPause(
      withRepeat(withTiming(1, { duration: 1000, easing }), -1, true),
      paused,
    )
  }, [paused, progress])
  return (
    <View style={styles.container}>
      <ChatBubble progress={progress} />
      <Button
        label={play ? "Pause" : "Play"}
        primary
        onPress={() => {
          setPlay((prev) => !prev)
          paused.value = !paused.value
        }}
      />
    </View>
  )
})
