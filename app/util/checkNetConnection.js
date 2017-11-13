import { NetInfo, Alert  } from 'react-native'
import resetNavigation from './resetNavigation'

const netInfo = {
  check: async (navigation, loginInfo) => {
    NetInfo.isConnected.fetch().then(isConnected => {
      Alert.alert('Network status', 'Connection is ' + (isConnected ? 'online' : 'offline'));
      if (isConnected) {
        NetInfo.isConnected.addEventListener(
          'change',
          handleConnectivityChange
        );
      }
    });
    function handleConnectivityChange(isConnected) {
      Alert.alert('Network status', 'Then, is ' + (isConnected ? 'online' : 'offline'));
    }
  },
}

export default netInfo
