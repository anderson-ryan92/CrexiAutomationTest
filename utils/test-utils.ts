import fs from 'fs';
import path from 'path';

export interface TestUser {
  email: string;
  password: string;
}

interface UsersByEnvironment {
    dev_users: TestUser[];
    qa_users: TestUser[];
    prod_users: TestUser[];
  }

function getEnvironment(): string {
    const env = process.env.TEST_ENV?.toLowerCase();
    if (!env || !['dev', 'qa', 'prod'].includes(env)) {
      throw new Error('TEST_ENV must be set to dev, qa, or prod');
    }
    return env;
  }

function readUsersFile(): UsersByEnvironment {
    const filePath = path.join(__dirname, '..', 'test-data', 'users.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

export function getTestUsers(): TestUser[] {
    const environment = getEnvironment();
    const allUsers = readUsersFile();
    const envUsers = allUsers[`${environment}_users`];
    if (!envUsers) {
      throw new Error(`No users found for environment: ${environment}`);
    }
    return envUsers.filter(user => user.email && user.password);  // Filter out empty users
}

export function getTestUser(index: number): TestUser {
    const users = getTestUsers();
    if (index < 0 || index >= users.length) {
      throw new Error(`Invalid user index: ${index}. Available users: 0 to ${users.length - 1}`);
    }
    return users[index];
}