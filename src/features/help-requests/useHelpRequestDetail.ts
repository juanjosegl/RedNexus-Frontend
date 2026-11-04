import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { useSessionStore } from '@/stores/session'
import { getHelpRequest } from './api'
import { helpRequestErrorMessage } from './errors'
import type { HelpRequestDetail } from './types'

const pollMs = 5000

export function useHelpRequestDetail(id: Ref<string>) {
  const request = ref<HelpRequestDetail | null>(null)
  const loading = ref(true)
  const error = ref('')
  let timer: ReturnType<typeof setInterval> | undefined

  async function load() {
    if (!request.value) loading.value = true
    error.value = ''
    try {
      request.value = await getHelpRequest(id.value)
    } catch (caught) {
      error.value = helpRequestErrorMessage(caught)
    } finally {
      loading.value = false
    }
  }

  function stop() {
    if (!timer) return
    clearInterval(timer)
    timer = undefined
  }

  function start() {
    stop()
    void load()
    timer = setInterval(() => {
      if (request.value?.status === 'PENDING') void load()
    }, pollMs)
  }

  onMounted(start)
  onUnmounted(stop)
  watch(id, () => {
    request.value = null
    start()
  })
  watch(
    () => useSessionStore().token,
    () => {
      request.value = null
      start()
    },
  )

  return { request, loading, error }
}
