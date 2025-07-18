import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Scanner from '../scanner'

export default function ProductQuery() {
  return (
    <View style={[styles.container]}>
      <Scanner />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});