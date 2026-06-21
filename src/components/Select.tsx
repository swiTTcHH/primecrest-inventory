// import React, { useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// export default function Select() {
//   const [selectedValue, setSelectedValue] = useState("js");

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Select Your Favorite Language:</Text>
      
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={selectedValue}
//           onValueChange={(itemValue) => setSelectedValue(itemValue)}
//         >
//           <Picker.Item label="JavaScript" value="js" />
//           <Picker.Item label="TypeScript" value="ts" />
//           <Picker.Item label="Python" value="py" />
//           <Picker.Item label="Go" value="go" />
//         </Picker>
//       </View>
      
//       <Text style={styles.result}>Selected: {selectedValue}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 70,
//     backgroundColor: '#fff',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#000',
//     backgroundColor: "#ffffff",
//     height: 100,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   result: {
//     marginTop: 20,
//     fontSize: 16,
//   },
// });


import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemeColors } from '@/utils/helpers';

export default function Select({data, value, setValue, label, identifier, defaultLabel="All",resultDisabled}: {data: any[], defaultLabel?: string,value: any, setValue: (value: any) => void, label?: string, identifier?: string; resultDisabled?: boolean}) {
  const theme = useThemeColors()

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: theme.text}]}>{label}</Text>
      
      <View style={[styles.pickerContainer, {backgroundColor: theme.backgroundElement}]}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => setValue(itemValue)}
          style={{color: theme.text, backgroundColor: theme.backgroundElement}}
          dropdownIconColor={theme.text}
        >
          <Picker.Item label={defaultLabel} value="" color={theme.text} style={{color: theme.text, backgroundColor: theme.backgroundElement}}/>
          {data && data.map((item) => (
            <Picker.Item key={item._id} label={item.name} value={identifier ? item[identifier] : item._id}  style={{color: theme.text, backgroundColor: theme.backgroundElement}} />
          ))}
        </Picker>
      </View>
      
      {!resultDisabled && <Text style={[styles.result, {color: theme.text}]}>Selected: {value}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 20,
    // backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: "#ffffff",
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
});
