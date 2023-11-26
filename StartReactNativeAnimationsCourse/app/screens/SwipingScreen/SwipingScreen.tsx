import React, { FC } from "react"
import { observer } from "mobx-react-lite"

import { AppStackScreenProps } from "app/navigators"

import { Profiles } from "./Profiles"
import type { ProfileModel } from "./Profile"

interface SwipingScreenProps extends AppStackScreenProps<"Swiping"> {}

export const profiles: ProfileModel[] = [
  {
    id: "1",
    name: "Caroline",
    age: 24,
    profile: require("./assets/1.jpg"),
  },
  {
    id: "2",
    name: "Jack",
    age: 30,
    profile: require("./assets/2.jpg"),
  },
  {
    id: "3",
    name: "Anet",
    age: 21,
    profile: require("./assets/3.jpg"),
  },
  {
    id: "4",
    name: "John",
    age: 28,
    profile: require("./assets/4.jpg"),
  },
]

export const SwipingScreen: FC<SwipingScreenProps> = observer(function SwipingScreen() {
  return <Profiles profiles={profiles} />
})
