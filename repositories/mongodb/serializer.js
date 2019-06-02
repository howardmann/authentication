const _serializeSingleUser = (user) => {
  return {
    'id': user._id,
    'email': user.email,
    'passwordHash': user.passwordHash,
    'phone': user.phone,
    'admin': user.admin
  };
};


const UserSerializer = (data) => {
  if (!data) { return null}
  if (Array.isArray(data)) {
    return data.map(_serializeSingleUser)
  }
  return _serializeSingleUser(data)
}


module.exports = UserSerializer
