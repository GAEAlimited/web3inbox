import Text from '../../general/Text'
import './SettingsSelector.scss'
import AppearanceIcon from '../../general/Icon/Appearance'
import NotificationIcon from '../../general/Icon/Notification'
import PrivacyIcon from '../../general/Icon/Privacy'
import NavLink from '../../general/NavLink'

const SettingsSelector: React.FC = () => {
  return (
    <div className="SettingsSelector">
      <div className="SettingsSelector__wrapper">
        <Text className="SettingsSelector__title" variant="large-700">
          Settings
        </Text>
        <ul className="SettingsSelector__list">
          <NavLink to={`/settings/appearance`} end className="SettingsSelector__link">
            <div className="SettingsSelector__link__wrapper">
              <AppearanceIcon />
              <Text className="SettingsSelector__link__title" variant="small-500">
                Appearance
              </Text>
            </div>
          </NavLink>
          <NavLink to="/settings/notification" end className="SettingsSelector__link">
            <div className="SettingsSelector__link__wrapper">
              <NotificationIcon />
              <Text className="SettingsSelector__link__title" variant="small-500">
                Notifications
              </Text>
            </div>
          </NavLink>
          <NavLink to={`/settings/privacy`} end className="SettingsSelector__link">
            <div className="SettingsSelector__link__wrapper">
              <PrivacyIcon />
              <Text className="SettingsSelector__link__title" variant="small-500">
                Privacy
              </Text>
            </div>
          </NavLink>
        </ul>
      </div>
    </div>
  )
}

export default SettingsSelector