import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { useSignOut } from '../hooks/useSignOut'

const SignOutButton = () => {
    const { handleSignOut } = useSignOut()
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Feather name="log-out" size={24} color="red" />
    </TouchableOpacity>
  )
}

export default SignOutButton