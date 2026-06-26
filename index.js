import '@expo/metro-runtime';
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('main', () => App);

if (typeof document !== 'undefined') {
  AppRegistry.runApplication('main', {
    rootTag: document.getElementById('root'),
  });
}
