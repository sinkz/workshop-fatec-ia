# Requirements Document

## Introduction

Sistema educacional completo para demonstrar integração entre API REST, MCP Server e Chat Frontend, desenvolvido para mini curso de IA aplicada a produtos. O sistema permite gerenciar produtos e vendas através de uma API, com um servidor MCP que fornece contexto dos endpoints para um chat inteligente.

## Glossary

- **Sales_API**: Sistema backend Express.js com JSON Server para gerenciar produtos e vendas
- **MCP_Server**: Servidor Model Context Protocol que fornece contexto dos endpoints da API
- **Chat_Frontend**: Interface web com páginas para produtos, vendas e chat integrado
- **Config_Module**: Módulo isolado de configuração para MCP, prompts e tokens
- **Seed_Data**: Dados iniciais pré-populados de produtos e vendas no JSON Server
- **Groq_Integration**: Integração com Groq.ai usando access token para processamento de chat

## Requirements

### Requirement 1

**User Story:** Como instrutor do curso, quero um backend completo com API de vendas e produtos, para que os alunos possam interagir com dados reais através de endpoints REST.

#### Acceptance Criteria

1. THE Sales_API SHALL provide REST endpoints for products management (GET, POST, PUT, DELETE)
2. THE Sales_API SHALL provide REST endpoints for sales management (GET, POST, PUT, DELETE)
3. THE Sales_API SHALL serve data from JSON Server with pre-populated seed data
4. THE Sales_API SHALL include at least 10 sample products and 20 sample sales in Seed_Data
5. THE Sales_API SHALL run on Express.js framework with proper error handling

### Requirement 2

**User Story:** Como desenvolvedor, quero um servidor MCP dinâmico e bem documentado, para que o chat possa ter contexto completo dos endpoints disponíveis.

#### Acceptance Criteria

1. THE MCP_Server SHALL implement Model Context Protocol specification
2. THE MCP_Server SHALL provide dynamic context about all Sales_API endpoints
3. THE MCP_Server SHALL include JSDoc documentation for all functions
4. THE MCP_Server SHALL use official MCP server library
5. THE MCP_Server SHALL be implemented as separate, maintainable module

### Requirement 3

**User Story:** Como usuário final, quero uma interface web intuitiva com navegação entre produtos, vendas e chat, para que possa visualizar dados e interagir via chat inteligente.

#### Acceptance Criteria

1. THE Chat_Frontend SHALL display a navigation menu with three pages: produtos, vendas, chat
2. THE Chat_Frontend SHALL fetch and display products data from Sales_API endpoints
3. THE Chat_Frontend SHALL fetch and display sales data from Sales_API endpoints
4. THE Chat_Frontend SHALL integrate with MCP_Server for chat functionality
5. THE Chat_Frontend SHALL have modern, attractive visual design

### Requirement 4

**User Story:** Como instrutor, quero configurações isoladas e fáceis de manter, para que os alunos possam modificar apenas as partes necessárias sem quebrar o sistema.

#### Acceptance Criteria

1. THE Config_Module SHALL isolate all MCP configuration in separate files
2. THE Config_Module SHALL isolate Groq.ai access token configuration in environment variables
3. THE Config_Module SHALL isolate default prompts and anti-hallucination settings
4. THE Config_Module SHALL be easily maintainable by course students
5. THE Config_Module SHALL include clear documentation for student modifications

### Requirement 5

**User Story:** Como desenvolvedor, quero integração eficiente entre frontend e MCP server, para que o chat funcione de forma responsiva e confiável.

#### Acceptance Criteria

1. WHEN MCP library is compatible with frontend, THE Chat_Frontend SHALL use MCP library directly
2. IF MCP library is not frontend-compatible, THEN THE Chat_Frontend SHALL use Server-Sent Events (SSE)
3. THE Chat_Frontend SHALL handle real-time communication with MCP_Server
4. THE Chat_Frontend SHALL provide proper error handling for chat interactions
5. THE Chat_Frontend SHALL integrate Groq_Integration for AI processing

### Requirement 6

**User Story:** Como instrutor, quero um sistema completo e funcional, para que possa focar no ensino sem preocupações técnicas durante o curso.

#### Acceptance Criteria

1. THE Sales_API SHALL be fully functional and ready for demonstration
2. THE MCP_Server SHALL be tested and working with all endpoints
3. THE Chat_Frontend SHALL be production-ready with proper styling
4. THE Config_Module SHALL be pre-configured with example settings
5. THE system SHALL include setup documentation for quick deployment
