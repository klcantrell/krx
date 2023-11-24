import { clamp, defineAnimation } from "react-native-reanimated"
import type {
  AnimatableValue,
  AnimationObject,
  Animation,
  SharedValue,
} from "react-native-reanimated"

interface PhysicsAnimationState {
  velocity: number
}

interface DecayAnimation extends Animation<DecayAnimation>, PhysicsAnimationState {
  current: number
  lastTimestamp: number
}

interface PhysicsAnimation extends Animation<PhysicsAnimation>, PhysicsAnimationState {
  current: number
}

interface PausableAnimation extends Animation<PausableAnimation> {
  lastTimestamp: number
  elapsed: number
  current: number
}

const VELOCITY_EPS = 5
const DECELERATION = 0.997

export const withDecay = (initialVelocity: number): DecayAnimation => {
  "worklet"

  return defineAnimation<DecayAnimation>(initialVelocity, () => {
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
  })
}

export const withBounce = <T extends PhysicsAnimationState & AnimationObject & { current: number }>(
  nextAnimation: T,
  lowerBound: number,
  upperBound: number,
): PhysicsAnimation => {
  "worklet"

  return defineAnimation<PhysicsAnimation>(nextAnimation, () => {
    "worklet"

    const onStart = (
      _state: PhysicsAnimation,
      current: AnimatableValue,
      now: number,
      previousAnimation: Animation<any> | PhysicsAnimation | null,
    ) => {
      nextAnimation.onStart(nextAnimation, current, now, previousAnimation)
    }

    const onFrame = (state: PhysicsAnimation, now: number) => {
      const finished = nextAnimation.onFrame(nextAnimation, now)
      const { current, velocity } = nextAnimation
      if ((velocity < 0 && current < lowerBound) || (velocity > 0 && current > upperBound)) {
        nextAnimation.velocity *= -0.5
        nextAnimation.current = clamp(current, lowerBound, upperBound)
      }

      state.current = nextAnimation.current
      return finished
    }

    return {
      onStart,
      onFrame,
      current: nextAnimation.current,
      velocity: 0,
    }
  })
}

export const withPause = (nextAnimation: number, paused: SharedValue<boolean>) => {
  "worklet"

  return defineAnimation<PausableAnimation>(nextAnimation, () => {
    "worklet"

    const next = (typeof nextAnimation === "function"
      ? // @ts-ignore
        nextAnimation()
      : nextAnimation) as unknown as AnimationObject & {
      current: number
    }

    if (next.onStart == null || next.onFrame == null) {
      throw new Error('Need to pass an animation to "withPause"')
    }

    const onStart = (
      state: PausableAnimation,
      current: AnimatableValue,
      now: number,
      previousAnimation: Animation<any> | PausableAnimation | null,
    ) => {
      state.elapsed = 0
      state.current = 0
      state.lastTimestamp = now
      next.onStart(next, current, now, previousAnimation)
    }

    const onFrame = (state: PausableAnimation, now: number) => {
      if (paused.value) {
        state.elapsed = now - state.lastTimestamp
        return false
      }
      const deltaTime = now - state.elapsed
      const finished = next.onFrame(next, deltaTime)
      state.current = next.current
      state.lastTimestamp = deltaTime
      return finished
    }

    return {
      onFrame,
      onStart,
      current: next.current,
      lastTimestamp: 0,
      elapsed: 0,
    }
  })
}
