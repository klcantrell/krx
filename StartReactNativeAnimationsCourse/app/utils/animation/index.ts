import { defineAnimation } from "react-native-reanimated"
import type { AnimatableValue, Animation } from "react-native-reanimated"

interface DecayAnimation extends Animation<DecayAnimation> {
  lastTimestamp: number
  velocity: number
  current: number
}

const VELOCITY_EPS = 5
const DECELERATION = 0.997

export const withDecay = (initialVelocity: number): number => {
  "worklet"

  return defineAnimation<DecayAnimation>(0, () => {
    "worklet"

    const onStart = (state: DecayAnimation, current: AnimatableValue, now: number) => {
      state.current = current as number
      state.velocity = initialVelocity
      state.lastTimestamp = now
    }

    const onFrame = (state: DecayAnimation, now: number) => {
      const { velocity, lastTimestamp, current } = state
      const deltaTime = now - lastTimestamp

      const v0 = velocity / 1000
      const kv = Math.pow(DECELERATION, deltaTime)
      const v = v0 * kv * 1000
      const x = current + (v0 * DECELERATION * (1 - kv)) / (1 - DECELERATION)

      state.velocity = v
      state.current = x
      state.lastTimestamp = now

      if (Math.abs(v) < VELOCITY_EPS) {
        return true
      }

      return false
    }

    return {
      onStart,
      onFrame,
      lastTimestamp: 0,
      current: 0,
      velocity: 0,
    }
  }) as unknown as number
}
