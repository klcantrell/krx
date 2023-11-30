import type { ReactNode } from "react"
import React, { Children, useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"

import { SortableItem } from "./SortableItem"
import { useSharedValue } from "react-native-reanimated"

interface SortableListProps {
  children: ReactNode
  item: { width: number; height: number }
}

export const SortableList = ({ children, item: { height, width } }: SortableListProps) => {
  const [ready, setReady] = useState(false)
  const [_, setChangeFlag] = useState(false)

  const offsets = useSharedValue<{ y: number }[]>([])
  const activeCard = useSharedValue<number | null>(null)

  const rerenderForSwap = () => {
    setChangeFlag((prev) => !prev)
  }

  useEffect(() => {
    offsets.value =
      Children.map(children, (_child, index) => {
        return { y: height * index }
      }) ?? []

    requestAnimationFrame(() => setReady(true))
  }, [children, height, offsets])

  return (
    <ScrollView
      contentContainerStyle={[
        {
          minHeight: height * Children.count(children),
        },
        styles.scrollContent,
      ]}
    >
      {ready &&
        Children.map(children, (child, index) => {
          return (
            <SortableItem
              onChange={rerenderForSwap}
              offsets={offsets}
              activeCard={activeCard}
              index={index}
              key={index}
              width={width}
              height={height}
            >
              {child}
            </SortableItem>
          )
        })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
})
