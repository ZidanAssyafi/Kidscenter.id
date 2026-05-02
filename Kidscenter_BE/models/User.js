const supabase = require('../config/supabase');

const User = {
  async findByUsernameOrEmail(username, email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async findByUsernameOrEmailLogin(identifier) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${identifier},email.eq.${identifier}`)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, username, email, whatsapp_number, role, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async create({
    name,
    username,
    email,
    whatsappNumber,
    passwordHash,
    role = 'CLIENT',
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        username,
        email,
        whatsapp_number: whatsappNumber,
        password_hash: passwordHash,
        role,
      })
      .select('id, name, username, email, whatsapp_number, role, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  },
};

module.exports = User;