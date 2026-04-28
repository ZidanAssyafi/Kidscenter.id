const supabase = require('../config/supabase');

const User = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  async create({ name, email, passwordHash, role = 'CLIENT' }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        role,
      })
      .select('id, name, email, role, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  },
};

module.exports = User;