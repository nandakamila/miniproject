import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { generateHashPassword, generateHashToken, generateJwtToken } from 'utils/auth';
import { generateRefferal } from 'utils/refferalCode';

import { addRefreshToken, deleteRefreshToken, findRefreshTokenById, revokeRefreshTokens } from '../auth/auth.controller';
import { JWT_REFRESH } from '../config';

// FIND BY (PARAMS)
const findUserByEmail = async (email: string) => {
  return await prisma.users.findUnique({
    where: {
      email,
    },
  });
}

const findUserById = async (id: string) => {
  return await prisma.users.findUnique({
    where: {
      id,
    },
  });
}

// HANDLER REGISTER
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
      res.status(400);
      throw new Error("Please fill in all the fields");
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400);
      throw new Error("Email already in use");
    }
    const hashPassword = await generateHashPassword(password);

    await prisma.$transaction(async (prisma) => {

    });
    const user = await prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPassword,
        role
      },
    });

    const participant = await prisma.participants.create({
      data: {
        userId: user.id,
        refferalCode: generateRefferal(),
      },
    });

    const organizer = await prisma.organizers.create({
      data: { userId: user.id },
    });

    const jtId = uuidv4();
    const { accessToken, refreshToken } = generateJwtToken(user, jtId);
    await addRefreshToken(jtId, refreshToken, user.id);

    res.json({
      accessToken,
      refreshToken,
    })

  } catch (err) {
    next(err);
  }
};

// HANDLER LOGIN
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('You must provide an email and a password.');
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }

    const jtId = uuidv4();
    const { accessToken, refreshToken } = generateJwtToken(existingUser, jtId);
    await addRefreshToken(jtId, refreshToken, existingUser.id);

    res.json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};

// TOKEN LOGIN
const getRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, JWT_REFRESH) as {
      jtId: string;
      userId: string;
    };

    const savedRefreshToken = await findRefreshTokenById(payload.jtId);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const hashedToken = await generateHashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jtId = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateJwtToken(user, jtId);
    await addRefreshToken(jtId, newRefreshToken, user.id);

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
}

const revokeRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    await revokeRefreshTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
};

// UPDATE DATA 
const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, password } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const dataToUpdate: any = {};
    if (firstName !== undefined) {
      dataToUpdate.firstName = firstName;
    }
    if (lastName !== undefined) {
      dataToUpdate.lastName = lastName;
    }
    if (password !== undefined) {
      dataToUpdate.password = password;
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: userId
      },
      data: dataToUpdate
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
const updateParticipant = async (req: Request, res: Response) => {
  try {
    const participantId = req.params.id;
    const { avatar, gender, location } = req.body;

    // Check if participant ID is provided
    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required.' });
    }

    const updatedParticipant = await prisma.participants.update({
      where: {
        id: participantId
      },
      data: {
        avatar,
        gender,
        location
      }
    });

    res.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const updateOrganizer = async (req: Request, res: Response) => {
  try {
    const organizerId = req.params.id;
    const { business_name, business_type, address, about, twitter, instagram, facebook } = req.body;

    if (!organizerId) {
      return res.status(400).json({ error: 'Organizer ID is required.' });
    }

    const dataToUpdate: any = {};
    if (business_name !== undefined) {
      dataToUpdate.business_name = business_name;
    }
    if (business_type !== undefined) {
      dataToUpdate.business_type = business_type;
    }
    if (address !== undefined) {
      dataToUpdate.address = address;
    }
    if (about !== undefined) {
      dataToUpdate.about = about;
    }
    if (twitter !== undefined) {
      dataToUpdate.twitter = twitter;
    }
    if (instagram !== undefined) {
      dataToUpdate.instagram = instagram;
    }
    if (facebook !== undefined) {
      dataToUpdate.facebook = facebook;
    }

    const updatedOrganizer = await prisma.organizers.update({
      where: {
        id: organizerId
      },
      data: dataToUpdate
    });

    res.json(updatedOrganizer);
  } catch (error) {
    console.error('Error updating organizer:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// DELETE DATA
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    await prisma.users.delete({
      where: {
        id: userId
      }
    });

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export default {
  findUserByEmail, findUserById,
  register, login,
  getRefreshToken, revokeRefreshToken,
  updateOrganizer, updateParticipant, updateUser, deleteUser
}