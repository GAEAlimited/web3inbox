import React, { useCallback, useContext, useMemo } from 'react'
import externalLinkIcon from '../../../../assets/ExternalLink.svg'
import SettingsContext from '../../../../contexts/SettingsContext/context'
import './AppCard.scss'
import Button from '../../../general/Button'
import W3iContext from '../../../../contexts/W3iContext/context'

interface AppCardProps {
  name: string
  description: string
  logo: string
  bgColor: {
    dark: string
    light: string
  }
  url: string
}

const AppCard: React.FC<AppCardProps> = ({ name, description, logo, bgColor, url }) => {
  const { mode } = useContext(SettingsContext)
  const { pushClientProxy } = useContext(W3iContext)
  const cardBgColor = useMemo(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const specifiedMode = mode === 'system' ? systemTheme : mode

    return specifiedMode === 'dark' ? bgColor.dark : bgColor.light
  }, [mode, bgColor])

  const handleSubscription = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }, [])

  return (
    <a
      className="AppCard"
      style={{ backgroundColor: cardBgColor }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="AppCard__header">
        <img className="AppCard__header__logo" src={logo} alt={`${name} logo`} />
        <img
          className="AppCard__header__link-icon"
          src={externalLinkIcon}
          alt={`navigate to ${url}`}
        />
      </div>

      <div className="AppCard__body">
        <h2 className="AppCard__body__name">{name}</h2>
        <div className="AppCard__body__description">{description}</div>
        <div className="AppCard__body__url">{url}</div>
        <Button className="AppCard__body__subscribe" onClick={e => handleSubscription(e)}>
          Subscribe
        </Button>
      </div>
    </a>
  )
}

export default AppCard
