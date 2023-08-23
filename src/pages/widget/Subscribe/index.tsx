import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/general/Button'
import W3iContext from '../../../contexts/W3iContext/context'
import W3iBellIcon from '../../../assets/W3iBell.svg'
import './Subscribe.scss'
import Spinner from '../../../components/general/Spinner'
import { showErrorMessageToast } from '../../../utils/toasts'

const WidgetSubscribe: React.FC = () => {
  const {
    pushClientProxy,
    userPubkey,
    dappOrigin,
    dappIcon,
    dappName,
    dappNotificationDescription,
    activeSubscriptions
  } = useContext(W3iContext)

  const [isSubscribing, setIsSubscribing] = useState(false)

  const nav = useNavigate()

  const handleOnSubscribe = useCallback(async () => {
    if (!pushClientProxy || !userPubkey) {
      return
    }
    const [isSubscribing, setIsSubscribing] = useState(false)

    setIsSubscribing(true)
    try {
      await pushClientProxy.subscribe({
        account: `eip155:1:${userPubkey}`,
        metadata: {
          description: dappNotificationDescription,
          icons: [dappIcon],
          name: dappName,
          url: dappOrigin
        }
      })
    } catch (error) {
      showErrorMessageToast('Failed to subscribe')
    } finally {
      setIsSubscribing(false)
    }

    /*
     * Not setting isLoading to false as it will transition to a different page once subscription is
     * done.
     */
    pushClientProxy.subscribe({
      account: `eip155:1:${userPubkey}`,
      metadata: {
        description: dappNotificationDescription,
        icons: [dappIcon],
        name: dappName,
        url: dappOrigin
      }
    })
  }, [pushClientProxy, dappOrigin, dappIcon, dappName, dappNotificationDescription, userPubkey])

  useEffect(() => {
    const dappSub = activeSubscriptions.find(sub => sub.metadata.url === dappOrigin)
    if (dappSub) {
      setTimeout(() => {
        nav(`/notifications/${dappSub.topic}`)
      }, 0)
    }
  }, [activeSubscriptions, nav])

  return (
    <div className="WidgetSubscribe">
      <div className="WidgetSubscribe__container">
        <div className="WidgetSubscribe__icon">
          <img src={W3iBellIcon} />
        </div>
        <h1 className="WidgetSubscribe__title">Notifications from {dappName}</h1>
        <p className="WidgetSubscribe__description">{dappNotificationDescription}</p>
        <Button onClick={handleOnSubscribe} disabled={isSubscribing}>
          {isSubscribing ? <Spinner width="1em" /> : <span>Enable (Subscribe in Wallet)</span>}
        </Button>
      </div>
    </div>
  )
}

export default WidgetSubscribe
