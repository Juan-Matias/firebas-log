import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TarBarButton from './TarBarButton';


export default function TabBar({ state, descriptors, navigation }) {



  const primatyColor = '#0891b2';
  const greyColor = '#737373';

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

      
        return(
          <TarBarButton
          key={route.key}
          style={styles.tabbarItem}
          
          onPress={onPress}
          onLongPress={onLongPress}

          isFocused={isFocused}
          routeName = {route.name}
          color={isFocused? primatyColor: greyColor}
          label={label}
          />
        )

        /*return (
          <TouchableOpacity

      
            key={route.key}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
          {
            icons[route.name]({
              color:isFocused? primatyColor:greyColor
            })
          }
            <Text style={{
              color: isFocused ? primatyColor: greyColor,
              fontSize:12
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );*/ 
      })}
    </View>
  );
}

const styles = StyleSheet.create(
  {
    tabbar:{
      position:'absolute',
      bottom:25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      marginHorizontal:20,
      paddingVertical:15,
      borderRadius:25,
      borderCurve:'continuos',
      shadowColor:'black',
      shadowOffset:{width:0,height:10},
      shadowOpacity:0.1
    }
  }
)
