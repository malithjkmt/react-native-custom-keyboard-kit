import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  NativeModules,
  TextInput,
  findNodeHandle,
  AppRegistry,
  View,
  Text,
} from 'react-native';

const { CustomKeyboardKit} = NativeModules;

const {
  install, uninstall,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
  hideKeyboard,
} = CustomKeyboardKit;

export {
  install, uninstall,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
  hideKeyboard,
};

const keyboardTypeRegistry = {};
let onDismiss = () => { }

export function register(type, factory) {
  keyboardTypeRegistry[type] = factory;
}

class CustomKeyboardKitContainer extends Component {
  render() {
    const {tag, type} = this.props;
    const factory = keyboardTypeRegistry[type];
    if (!factory) {
      console.warn(`Custom keyboard type ${type} not registered.`);
      return null;
    }
    const Comp = factory();
    return <Comp tag={tag} onDismiss={onDismiss}/>;
  }
}

AppRegistry.registerComponent("CustomKeyboardKit", () => CustomKeyboardKitContainer);

export class CustomTextInput extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    customKeyboardType: PropTypes.string,
  }

  componentDidMount() {
    install(findNodeHandle(this.input), this.props.customKeyboardType);
    onDismiss = this.props.onDismiss;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.customKeyboardType !== this.props.customKeyboardType) {
      install(findNodeHandle(this.input), newProps.customKeyboardType);
      onDismiss = this.props.onDismiss;
    }
  }

  onRef = ref => {
    this.input = ref;
  }

  render() {
    const { customKeyboardType, ...others } = this.props;
    return (
      <View>
        <TextInput {...others} ref={this.onRef} />
      </View>
    );
  }
}
