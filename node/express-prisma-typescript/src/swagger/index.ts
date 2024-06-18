import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc'

const swaggerDefinition: OAS3Definition = {
  openapi: '3.1.0',
  info: {
    title: 'Twitter Back-end Documentation',
    version: '1.0.0'
  },

  servers: [
    {
      url: 'http://localhost:8080/api',
      description: 'Development server'
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ],

    schemas: {
      SignupInputDTO: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@gmail.com'
          },
          username: {
            type: 'string',
            example: 'username'
          },
          password: {
            type: 'string',
            format: 'strong password',
            example: 'Secret.password1'
          }
        }
      },
      LoginInputDTO: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@gmail.com'
          },
          username: {
            type: 'string',
            example: 'username'
          },
          password: {
            type: 'string',
            format: 'strong password',
            example: 'Secret.password1'
          }
        }
      },
      UserDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          name: {
            type: 'string',
            example: 'User1'
          },
          createdAt: {
            type: 'DateTime',
            example: '2022-01-01T00:00:00.000Z'
          }
        }
      },
      UserViewDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          name: {
            type: 'string',
            example: 'User1'
          },
          username: {
            type: 'string',
            example: 'username'
          },
          profilePicture: {
            type: 'string',
            example: 'https://www.google.com/image.jpg'
          }
        }
      },
      ResponseToken: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDc0YmFhZC0wOGE1LTQ3NGItOWM3Ny02OWNmMzZkNDk0N2E5IiwiaWF0IjoxNjY5MjIwNjIyLCJleHAiOjE2NjkyMjQyMjJ9.7'
          }
        }
      },
      ChatDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          name: {
            type: 'string',
            example: 'Chat1'
          }
        }
      },
      ExtendedChatDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          name: {
            type: 'string',
            example: 'Chat1'
          },
          messages: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/MessageDTO'
            }
          },
          users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/UserViewDTO'
            }
          }
        }
      },
      MessageDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          senderId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          chatId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          content: {
            type: 'string',
            example: 'Hello'
          },
          date: {
            type: 'DateTime',
            example: '2022-01-01T00:00:00.000Z'
          }
        }
      },
      SendMessageDTO: {
        type: 'object',
        required: ['chatId', 'senderId', 'content'],
        properties: {
          chatId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          senderId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          content: {
            type: 'string',
            example: 'Hello'
          }
        }
      },
      PostDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          authorId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          content: {
            type: 'string',
            example: 'Hello'
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              example: 'https://www.google.com/image.jpg'
            }
          },
          createdAt: {
            type: 'DateTime',
            example: '2022-01-01T00:00:00.000Z'
          }
        }
      },
      CreatePostInputDTO: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'string',
            example: 'Hello'
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              example: 'https://www.google.com/image.jpg'
            }
          }
        }
      },
      ExtendedPostDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          authorId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          content: {
            type: 'string',
            example: 'Hello'
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              example: 'https://www.google.com/image.jpg'
            }
          },
          createdAt: {
            type: 'DateTime',
            example: '2022-01-01T00:00:00.000Z'
          },
          author: {
            $ref: '#/components/schemas/UserViewDTO'
          },
          qtyComments: {
            type: 'number',
            example: 1
          },
          qtyLikes: {
            type: 'number',
            example: 1
          },
          qtyRetweets: {
            type: 'number',
            example: 1
          }
        }
      },
      ReactionDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          userId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          postId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          reactionType: {
            example: 'LIKE'
          }
        }
      },
      ReactionInputDTO: {
        type: 'object',
        required: ['userId', 'postId', 'reactionType'],
        properties: {
          userId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          postId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          reactionType: {
            example: 'LIKE'
          }
        }
      },
      FollowDTO: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          followerId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          followedId: {
            type: 'string',
            example: '6474baad-08a5-474b-9c77-69c36d4947a9'
          },
          createdAt: {
            type: 'DateTime',
            example: '2022-01-01T00:00:00.000Z'
          }
        }
      }
    }
  },

  tags: [
    {
      name: 'Auth'
    },
    {
      name: 'User'
    },
    {
      name: 'Chat'
    },
    {
      name: 'Comment'
    },
    {
      name: 'Reaction'
    },
    {
      name: 'Post'
    },
    {
      name: 'Follow'
    },
    {
      name: 'Health'
    }
  ],

  paths: {
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Signup user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SignupInputDTO'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResponseToken'
                }
              }
            }
          },
          409: {
            description: 'Conflict'
          },
          400: {
            description: 'Bad Request'
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginInputDTO'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResponseToken'
                }
              }
            }
          },
          400: {
            description: 'Bad Request'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },

    '/user': {
      get: {
        tags: ['User'],
        summary: 'Get recommended users',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            }
          },
          {
            name: 'skip',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/UserVeiwDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          }
        }
      },
      delete: {
        tags: ['User'],
        summary: 'Delete user',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          }
        }
      }
    },
    '/user/me': {
      get: {
        tags: ['User'],
        summary: 'Get user',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserViewDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          }
        }
      }
    },
    '/user/followers': {
      get: {
        tags: ['User'],
        summary: 'Get followers',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/UserViewDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          }
        }
      }
    },
    '/user/follows': {
      get: {
        tags: ['User'],
        summary: 'Get follows',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/UserViewDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          }
        }
      }
    },
    '/user/{userId}': {
      get: {
        tags: ['User'],
        summary: 'Get user',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserViewDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/user/switch-account-type': {
      patch: {
        tags: ['User'],
        summary: 'Switch account type',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/user/upload-profile-picture': {
      post: {
        tags: ['User'],
        summary: 'Upload profile picture',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/user/by_username/{username}': {
      get: {
        tags: ['User'],
        summary: 'Get users filtered by username',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            }
          },
          {
            name: 'skip',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/UserViewDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },

    '/chat': {
      post: {
        tags: ['Chat'],
        summary: 'Create chat',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'Chat1'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChatDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          400: {
            description: 'Bad Request'
          }
        }
      }
    },
    '/chat/{chatId}': {
      get: {
        tags: ['Chat'],
        summary: 'Get chat',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ExtendedChatDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      },
      delete: {
        tags: ['Chat'],
        summary: 'Delete chat',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      },
      post: {
        tags: ['Chat'],
        summary: 'Send message to chat',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                properties: {
                  content: {
                    type: 'string',
                    example: 'Hello'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessageDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/chat/add-user/{chatId}': {
      post: {
        tags: ['Chat'],
        summary: 'Add user to chat',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                properties: {
                  userId: {
                    type: 'string',
                    example: '6474baad-08a5-474b-9c77-69c36d4947a9'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/chat/remove-user/{chatId}': {
      delete: {
        tags: ['Chat'],
        summary: 'Remove user from chat',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                properties: {
                  userId: {
                    type: 'string',
                    example: '6474baad-08a5-474b-9c77-69c36d4947a9'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/chat/leave/{chatId}': {
      delete: {
        tags: ['Chat'],
        summary: 'Leave chat',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },

    '/comment/{postId}': {
      post: {
        tags: ['Comment'],
        summary: 'Comment post',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreatePostInputDTO'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PostDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      },
      delete: {
        tags: ['Comment'],
        summary: 'Delete comment',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      },
      get: {
        tags: ['Comment'],
        summary: 'Get comments by post',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            }
          },
          {
            name: 'before',
            in: 'query',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'after',
            in: 'query',
            required: false,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ExtendedPostDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/comment/user/{userId}': {
      get: {
        tags: ['Comment'],
        summary: 'Get comments by user',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/PostDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },

    '/reaction/{postId}': {
      post: {
        tags: ['Reaction'],
        summary: 'React to post',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                properties: {
                  reactionType: {
                    type: 'string',
                    example: 'LIKE'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Created'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      },
      delete: {
        tags: ['Reaction'],
        summary: 'Delete reaction',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                properties: {
                  reactionType: {
                    type: 'string',
                    example: 'LIKE'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          },
          400: {
            description: 'Bad Request'
          }
        }
      }
    },
    '/reaction/likes/{userId}': {
      get: {
        tags: ['Reaction'],
        summary: 'Get likes by user',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ReactionInputDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          },
          400: {
            description: 'Bad Request'
          }
        }
      }
    },
    '/reaction/retweets/{userId}': {
      get: {
        tags: ['Reaction'],
        summary: 'Get retweets by user',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ReactionInputDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          },
          400: {
            description: 'Bad Request'
          }
        }
      }
    },

    '/post': {
      post: {
        tags: ['Post'],
        summary: 'Create post',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreatePostInputDTO'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PostDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          400: {
            description: 'Bad Request'
          }
        }
      },
      get: {
        tags: ['Post'],
        summary: 'Get posts',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            }
          },
          {
            name: 'before',
            in: 'query',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'after',
            in: 'query',
            required: false,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ExtendedPostDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          }
        }
      }
    },
    '/post/{postId}': {
      get: {
        tags: ['Post'],
        summary: 'Get post',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PostDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      },
      delete: {
        tags: ['Post'],
        summary: 'Delete post',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/post/by_user/{userId}': {
      get: {
        tags: ['Post'],
        summary: 'Get posts by user',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ExtendedPostDTO'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },

    '/follower/follow/{userId}': {
      post: {
        tags: ['Follow'],
        summary: 'Follow user',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FollowDTO'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },
    '/follower/unfollow/{userId}': {
      delete: {
        tags: ['Follow'],
        summary: 'Unfollow user',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Not Found'
          }
        }
      }
    },

    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check health',
        responses: {
          200: {
            description: 'OK'
          }
        }
      }
    }
  }
}

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ['./src/router/*.ts']
}

export default swaggerJSDoc(swaggerOptions)
