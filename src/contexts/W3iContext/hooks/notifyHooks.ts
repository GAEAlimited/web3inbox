import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { EventEmitter } from 'events'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { noop } from 'rxjs'
import type Web3InboxProxy from '../../../w3iProxy'
import type { W3iNotifyClient } from '../../../w3iProxy'
import { JsCommunicator } from '../../../w3iProxy/externalCommunicators/jsCommunicator'
import { useAuthState } from './authHooks'
import { useUiState } from './uiHooks'

export const useNotifyState = (w3iProxy: Web3InboxProxy, proxyReady: boolean, dappOrigin: string) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    NotifyClientTypes.NotifySubscription[]
  >([])

  const { pathname } = useLocation()
  const [emitter] = useState(new EventEmitter())

  const { userPubkey } = useAuthState(w3iProxy, proxyReady)
  const { uiEnabled } = useUiState()

  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const [registeredKey, setRegistered] = useState<string | null>(null)

  const [notifyClient, setNotifyClient] = useState<W3iNotifyClient | null>(null)

  useEffect(() => {
    if (proxyReady) {
      setNotifyClient(w3iProxy.notify)
    }
  }, [w3iProxy, proxyReady])

  const refreshNotifyState = useCallback(() => {
    if (!proxyReady || !notifyClient || !userPubkey) {
      return
    }
    notifyClient.getActiveSubscriptions({ account: `eip155:1:${userPubkey}` }).then(subscriptions => {
      setActiveSubscriptions(Object.values(subscriptions))
    })
  }, [notifyClient, userPubkey, proxyReady])

  useEffect(() => {
    // Account for sync init
    const timeoutId = setTimeout(() => refreshNotifyState(), 100)

    return () => clearTimeout(timeoutId)
  }, [refreshNotifyState])

  const handleRegistration = useCallback(
    async (key: string) => {
      if (notifyClient && key && uiEnabled.notify) {
        try {
          const identityKey = await notifyClient.register({
            account: `eip155:1:${key}`,
            domain: window.location.hostname,
            isLimited: false
          })

          setRegisterMessage(null)
          setRegistered(identityKey)
          refreshNotifyState()
        } catch (error) {
          setRegisterMessage(null)
        }
      }
    },
    [uiEnabled, notifyClient, refreshNotifyState, setRegisterMessage]
  )

  useEffect(() => {
    if (userPubkey) {
      handleRegistration(userPubkey)
    } else {
      setRegisterMessage(null)
    }
  }, [handleRegistration, setRegisterMessage, userPubkey])

  useEffect(() => {
    if (!userPubkey) {
      setRegistered(null)
    }
  }, [userPubkey, setRegistered])

  useEffect(() => {
    if (!notifyClient) {
      return noop
    }

    const notifySignatureRequestedSub = notifyClient.observe('notify_signature_requested', {
      next: ({ message }) => setRegisterMessage(message)
    })

    const notifySignatureRequestCancelledSub = notifyClient.observe(
      'notify_signature_request_cancelled',
      {
        next: () => setRegisterMessage(null)
      }
    )

    const notifySubscriptionSub = notifyClient.observe('notify_subscription', {
      next: refreshNotifyState
    })
    const notifyDeleteSub = notifyClient.observe('notify_delete', {
      next: refreshNotifyState
    })
    const notifyUpdateSub = notifyClient.observe('notify_update', {
      next: refreshNotifyState
    })

    const notifySubsChanged = notifyClient.observe('notify_subscriptions_changed', {
      next: refreshNotifyState
    })

    const syncUpdateSub = notifyClient.observe('sync_update', {
      next: refreshNotifyState
    })

    return () => {
      notifySubscriptionSub.unsubscribe()
      syncUpdateSub.unsubscribe()
      notifyUpdateSub.unsubscribe()
      notifyDeleteSub.unsubscribe()
      notifySubsChanged.unsubscribe()
      notifySignatureRequestedSub.unsubscribe()
      notifySignatureRequestCancelledSub.unsubscribe()
    }
  }, [notifyClient, refreshNotifyState])

  const checkAndInformIfWidgetSubbed = useCallback(() => {
    if (!notifyClient) {
      return
    }

    notifyClient.getActiveSubscriptions({ account: `eip155:1:${userPubkey ?? ''}` }).then(subs => {
      const dappSubExists = Object.values(subs)
        .map(sub => sub.metadata.appDomain)
        .some(url => url === dappOrigin)
      if (dappSubExists) {
        const communicator = new JsCommunicator(emitter)
        communicator.postToExternalProvider('dapp_subscription_settled', {}, 'notify')
      }
    })
  }, [userPubkey, notifyClient, dappOrigin, emitter])

  return { activeSubscriptions, registeredKey, registerMessage, notifyClient, refreshNotifyState }
}