import { ref } from "vue"

export const useBool = (initalValue: boolean) => {
  const bool = ref(initalValue)
  return {
    ref:bool,
    toggle: () => bool.value = !bool.value,
    on: () => bool.value = true,
    off: () => bool.value = false
  }
}