/* eslint-disable react-native/no-color-literals */
import React from "react"
import { Dimensions, Image, StyleSheet, Text, View } from "react-native"
import Animated, {
  useAnimatedStyle,
  type SharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"

export interface ProfileModel {
  id: string
  name: string
  age: number
  profile: number
}

const { width, height } = Dimensions.get("window")
export const maxAngle = Math.PI / 12
export const A = Math.sin(maxAngle) * height + Math.cos(maxAngle) * width

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    height: undefined,
    width: undefined,
  },
  like: {
    borderColor: "#6ee3b4",
    borderRadius: 5,
    borderWidth: 4,
    padding: 8,
  },
  likeLabel: {
    color: "#6ee3b4",
    fontSize: 32,
    fontWeight: "bold",
  },
  name: {
    color: "white",
    fontSize: 32,
  },
  nope: {
    borderColor: "#ec5288",
    borderRadius: 5,
    borderWidth: 4,
    padding: 8,
  },
  nopeLabel: {
    color: "#ec5288",
    fontSize: 32,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
})

interface CardProps {
  profile: ProfileModel
  onTop: boolean
  translateX: SharedValue<number>
  translateY: SharedValue<number>
  scale: SharedValue<number>
}

export const Profile = ({ profile, translateX, translateY, scale, onTop }: CardProps) => {
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        {
          rotate: `${interpolate(
            translateX.value,
            [-width / 2, 0, width / 2],
            [-maxAngle, 0, maxAngle],
            Extrapolate.CLAMP,
          )}rad`,
        },
        { scale: onTop ? 1 : scale.value },
      ],
    }
  })
  const animatedLikeStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, width / 4], [0, 1], Extrapolate.CLAMP),
    }
  })
  const animatedNopeStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [-width / 4, 0], [1, 0], Extrapolate.CLAMP),
    }
  })

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedContainerStyle]}>
      <Image style={styles.image} source={profile.profile} />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Animated.View style={[styles.like, animatedLikeStyle]}>
            <Text style={styles.likeLabel}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.nope, animatedNopeStyle]}>
            <Text style={styles.nopeLabel}>NOPE</Text>
          </Animated.View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.name}>{profile.name}</Text>
        </View>
      </View>
    </Animated.View>
  )
}
