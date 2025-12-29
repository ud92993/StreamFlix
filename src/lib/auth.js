import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Import de connectDB
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connecté');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Définition du schéma Admin directement ici
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin',
  },
  lastLogin: {
    type: Date,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
}, {
  timestamps: true,
});

AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 Tentative de connexion:', credentials?.email);
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email et mot de passe requis');
          }

          await connectDB();
          console.log('✅ Connecté à MongoDB');

          const admin = await Admin.findOne({ email: credentials.email }).select('+password');
          console.log('👤 Admin trouvé:', admin ? 'OUI' : 'NON');

          if (!admin) {
            throw new Error('Identifiants invalides');
          }

          const isValid = await admin.comparePassword(credentials.password);
          console.log('🔑 Mot de passe valide:', isValid ? 'OUI' : 'NON');

          if (!isValid) {
            throw new Error('Identifiants invalides');
          }

          await Admin.updateOne(
            { _id: admin._id },
            { $set: { loginAttempts: 0, lastLogin: new Date() } }
          );

          console.log('✅ Authentification réussie !');

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch (error) {
          console.error('❌ Erreur auth:', error.message);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};