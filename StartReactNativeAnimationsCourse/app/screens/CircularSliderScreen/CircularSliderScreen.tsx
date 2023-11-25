import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, PixelRatio, StyleSheet, View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { canvas2Polar } from "react-native-redash"
import Animated, {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated"
import { StyleGuide } from "app/components/animated"
import { CircularProgress } from "./CircularProgress"
import { Cursor } from "./Cursor"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

const { width } = Dimensions.get("window")
const size = width - 32
const STROKE_WIDTH = 40
const r = PixelRatio.roundToNearestPixel(size / 2)
const defaultTheta = canvas2Polar({ x: 0, y: 0 }, { x: r, y: r }).theta
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  content: {
    height: r * 2,
    width: r * 2,
  },
})

interface CircularSliderScreenProps extends AppStackScreenProps<"CircularSlider"> {}

export const CircularSliderScreen: FC<CircularSliderScreenProps> = observer(
  function CircularSliderScreen() {
    const theta = useSharedValue(defaultTheta)
    const backgroundColor = useDerivedValue(() => {
      return interpolateColor(
        theta.value,
        [0, Math.PI, Math.PI * 2],
        ["#ff3884", StyleGuide.palette.primary, "#38ffb3"],
      )
    })

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Animated.View style={StyleSheet.absoluteFill}>
            <CircularProgress
              backgroundColor={backgroundColor}
              strokeWidth={STROKE_WIDTH}
              r={r}
              theta={theta}
            />
          </Animated.View>
          <Cursor
            backgroundColor={backgroundColor}
            strokeWidth={STROKE_WIDTH}
            r={r - STROKE_WIDTH / 2}
            theta={theta}
          />
        </View>
      </View>
    )
  },
)
