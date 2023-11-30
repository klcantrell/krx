import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, View, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { SortableList } from "./SortableList"

import { Cards, Card } from "app/components/animated"
import { CARD_HEIGHT } from "app/components/animated/Card"

const { width } = Dimensions.get("window")
const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    height: CARD_HEIGHT,
    marginTop: 32,
    width: "100%",
  },
})
const cards = [Cards.Card1, Cards.Card2, Cards.Card3]

interface DragToSortScreenProps extends AppStackScreenProps<"DragToSort"> {}

export const DragToSortScreen: FC<DragToSortScreenProps> = observer(function DragToSortScreen() {
  return (
    <SortableList item={{ width, height: CARD_HEIGHT + 32 }}>
      {cards.map((card, index) => (
        <View style={styles.card} key={index}>
          <Card card={card} />
        </View>
      ))}
    </SortableList>
  )
})
