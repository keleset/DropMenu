'use strict';

import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';

export default class DropMenu extends Component {
  static propTypes = {
    buttonRender: PropTypes.func,
    itemRender: PropTypes.func,
    disabled: PropTypes.bool,
    options: PropTypes.array,
    closeOnSelect: PropTypes.bool,

    accessible: PropTypes.bool,
    animated: PropTypes.bool,

    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

    adjustFrame: PropTypes.func,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    options: null,
    animated: true,
    closeOnSelect: true,
  };

  constructor(props) {
    super(props);

    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;

    this.state = {
      accessible: !!props.accessible,
      loading: !props.options,
      showDropdown: false,
    };
  }

  render() {
    return (
      <View {...this.props}>
        {this._renderButton()}
        {this._renderModal()}
      </View>
    );
  }

  _updatePosition(callback) {
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = {x: px, y: py, w: width, h: height};
        callback && callback();
      });
    }
  }

  show() {
    this._updatePosition(() => {
      this.setState({
        showDropdown: true
      });
    });
  }

  hide() {
    this.setState({
      showDropdown: false
    });
  }

  _renderButton() {
    const {disabled, accessible, children} = this.props;

    return (
      <TouchableOpacity ref={button => this._button = button}
                        disabled={disabled}
                        accessible={accessible}
                        onPress={this._onButtonPress}
      >
        {
          children ||
          (
            this.props.buttonRender()
          ) || (
            null
          )
        }
      </TouchableOpacity>
    );
  }

  _onButtonPress = () => {
    const {onDropdownWillShow} = this.props;
    if (!onDropdownWillShow ||
      onDropdownWillShow() !== false) {
      this.show();
    }
  };

  _renderModal() {
    const {animated, accessible, dropdownStyle} = this.props;
    const {showDropdown, loading} = this.state;
    if (showDropdown && this._buttonFrame) {
      const frameStyle = this._calcPosition();
      const animationType = animated ? 'fade' : 'none';
      return (
        <Modal animationType={animationType}
               visible={true}
               transparent={true}
               onRequestClose={this._onRequestClose}
               supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        >
          <TouchableWithoutFeedback accessible={accessible}
                                    disabled={!showDropdown}
                                    onPress={this._onModalPress}
          >
            <View style={styles.modal}>
              <View style={[styles.dropdown, dropdownStyle, frameStyle]}>
                {loading ? this._renderLoading() : this._renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  _calcPosition() {
    const {dropdownStyle, style, adjustFrame} = this.props;

    const dimensions = Dimensions.get('window');
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;

    const dropdownHeight = (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
      StyleSheet.flatten(styles.dropdown).height;

    const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    const rightSpace = windowWidth - this._buttonFrame.x;
    const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
    const showInLeft = rightSpace >= this._buttonFrame.x;

    const positionStyle = {
      height: dropdownHeight,
      top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
    };

    if (showInLeft) {
      positionStyle.left = this._buttonFrame.x;
    } else {
      const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
        (style && StyleSheet.flatten(style).width) || -1;
      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }
      positionStyle.right = rightSpace - this._buttonFrame.w;
    }

    return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
  }

  _onRequestClose = () => {
    const {onDropdownWillHide} = this.props;
    if (!onDropdownWillHide ||
      onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _onModalPress = () => {
    const {onDropdownWillHide} = this.props;
    if (!onDropdownWillHide ||
      onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _renderLoading() {
    return (
      <ActivityIndicator size='small'/>
    );
  }

  _renderDropdown() {
    const { options } = this.props;
    return (
      <FlatList 
        style={styles.list}
        data={options}
        renderItem={this._renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  _renderItem = ({item}) => (
    (
      (typeof item.itemRender === 'undefined') ? null : item.itemRender(() => this._onRequestClose())
    ) || (
      <TouchableOpacity onPress={(typeof item.action === 'undefined') ? null : () => {
        item.action();
        if (this.props.closeOnSelect) {
          this._onRequestClose();
        }
      }}>
        { null || (
            (typeof item.title === 'undefined') ? this.props.itemRender() : this.props.itemRender(item.title)
          )
        }
      </TouchableOpacity>
    )
  );
}

const styles = StyleSheet.create({
  modal: {
    flexGrow: 1
  },
  dropdown: {
    position: 'absolute',
    height: (33 + StyleSheet.hairlineWidth) * 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  loading: {
    alignSelf: 'center'
  },
  list: {
  },
});
