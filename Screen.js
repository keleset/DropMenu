import React, {Component} from 'react';
import { connect } from "react-redux";
import { View, ScrollView, Text, Image, Modal, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import DropMenu from '../DropMenu';

//DEBUG TODO
import { Alert } from 'react-native';

class Screen extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('HeaderTitle', ''),
      headerLeft: navigation.getParam('HeaderLeft', ''),
      headerRight: navigation.getParam('HeaderRight', ''),
    };
  };
  
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    }
  }

  openMenu(visible) {
    this.setState({menuVisible: visible});
  }

  setNavigationHeader() {
    const DEMO_OPTIONS_1 = [
      {
        title: 'option 1',

        itemRender: () => {
          return(
            <TouchableOpacity onPress={null}>
              <View style={{backgroundColor: '#ffafaf'}}>
                <Text style={{margin: 10}}>OpTiOn 1</Text>
              </View>
            </TouchableOpacity>
          );
        },

      },

      {
        title: 'option 2',
        action: () => {
          Alert.alert(
            'Alert',
            alertText,
            [
              {text: 'OK'},
            ],
            {cancelable: false},
          );
        }
      },

      {
        title: 'option 3',

        itemRender: (closeMenu) => {
          return(
            <TouchableOpacity onPress={closeMenu}>
              <View style={{backgroundColor: '#afafff'}}>
                <Text style={{margin: 10}}>oPtIoN 3</Text>
              </View>
            </TouchableOpacity>
          );
        },
      },

      {
        title: 'option 4',

        action: () => {
          null
        }
      },

      {
        title: 'option 5',

        action: () => {
          null
        }
      }
    ];

    const alertText = 'Alert 1!';

    this.props.navigation.setParams({
      HeaderTitle: (
          <Text>HEADER</Text>
      ),
      HeaderLeft: (
        <Button
          onPress={() => {}
          }
          icon={
            <Icon
              name="menu"
              size={30}
              type="imaterial"
              color="green"
            />
          }
          type="clear"
        />
      ),
      HeaderRight: (
        <DropMenu 
          style={{
            flex: 1,
          }}

          options={DEMO_OPTIONS_1}

          itemRender={(title) => {
            return(
              <View style={{backgroundColor: '#aaffaa'}}>
                <Text style={{margin: 20}}>{title}</Text>
              </View>
            );
          }}

          buttonRender={() => {
            return (
              <View style={{width: 30}}>
                <Icon
                  name="more-vert"
                  size={30}
                  type="imaterial"
                  color="green"
                />
              </View>
            );
          }}
        />
      )
    });
  }
   
  componentDidMount() {
    const { navigation } = this.props;
    this.setNavigationHeader();
  }
  
  render(){
    return (
      <Text>Hello World</Text>
    );
  }
}


function mapStateToProps(state, ownProps) {
    return {
    };
  }
  
export default connect(mapStateToProps)(SyncScreen);
