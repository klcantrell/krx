import React, { useCallback, useRef, useState } from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import { Feather as Icon } from "@expo/vector-icons"
import { RectButton } from "react-native-gesture-handler"

import { StyleGuide } from "app/components/animated"

import type { ProfileModel } from "./Profile"
import { Swipeable, SwipeableRef } from "./Swipeable"
import { useSharedValue } from "react-native-reanimated"

const styles = StyleSheet.create({
  cards: {
    flex: 1,
    marginHorizontal: 16,
    zIndex: 100,
  },
  // eslint-disable-next-line react-native/no-color-literals
  circle: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    padding: 12,
    shadowColor: "gray",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    width: 64,
  },
  container: {
    backgroundColor: StyleGuide.palette.background,
    flex: 1,
    justifyContent: "space-evenly",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
})

interface ProfilesProps {
  profiles: ProfileModel[]
}

export const Profiles = ({ profiles: defaultProfiles }: ProfilesProps) => {
  const [profiles, setProfiles] = useState(defaultProfiles)

  const topCard = useRef<SwipeableRef>(null)

  const onSwipe = useCallback(() => {
    setProfiles(profiles.slice(0, profiles.length - 1))
  }, [profiles])

  const scale = useSharedValue(0.95)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="user" size={32} color="gray" />
        <Icon name="message-circle" size={32} color="gray" />
      </View>
      <View style={styles.cards}>
        {profiles.map((profile, index) => {
          const onTop = index === profiles.length - 1
          const ref = onTop ? topCard : null
          return (
            <Swipeable
              ref={ref}
              key={profile.id}
              profile={profile}
              onSwipe={onSwipe}
              scale={scale}
              onTop={onTop}
            />
          )
        })}
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.circle} onPress={() => topCard.current?.swipeLeft()}>
          <Icon name="x" size={32} color="#ec5288" />
        </RectButton>
        <RectButton style={styles.circle} onPress={() => topCard.current?.swipeRight()}>
          <Icon name="heart" size={32} color="#6ee3b4" />
        </RectButton>
      </View>
    </SafeAreaView>
  )
}
