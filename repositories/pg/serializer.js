const _serializeSingleUser = (user) => {
  return {
    'id': user.id,
    'email': user.email,
    'passwordHash': user.password_hash,
    'phone': user.phone,
    'admin': user.admin
  };
};


const UserSerializer = (data) => {
  if (!data) {
    return null
  }
  if (Array.isArray(data)) {
    return data.map(_serializeSingleUser)
  }
  return _serializeSingleUser(data)
}


module.exports = UserSerializer
