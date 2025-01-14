# n8n-nodes-pocketbase-admin

This n8n community node lets you use PocketBase in your n8n workflows.

PocketBase is an open source backend consisting of embedded database (SQLite) with realtime subscriptions, built-in auth management, convenient dashboard UI and simple REST-ish API.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This module support all CRUD actions, executed as admin.

- Get List
- Get One
- Get Full List
- Get First List Item
- Update
- Create
- Delete

## Compatibility

- n8n >=1.49.0
- PocketBase >=0.23.0
- Node.js >=18.10.0

If you are using PocketBase 0.22 or older, please stick with version 1.0.0 of this node, since Pocketbase introduced major changes in the API.

Older versions may work, but are not tested.

## Similarity with n8n-nodes-pocketbase

This module is a fork of [n8n-nodes-pocketbase](https://github.com/TheFehr/n8n-nodes-pocketbase) with some changes:

- All actions are performed as admin
- Adds support for `getFirstListItem`, `getFullList` and `delete` actions
- Adds support for `skipTotal` parameter

Those modules are not compatible with each other, but can be installed together and used side by side.

## Resources

- [PocketBase Introduction](https://pocketbase.io/docs/)
- [PocketBase APIs reference](https://pocketbase.io/docs/api-records/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
