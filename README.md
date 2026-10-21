# n8n-nodes-pocketbase-admin

> [!WARNING]
> **This package is deprecated and no longer maintained.**
> Use [n8n-nodes-pocketbase](https://github.com/TheFehr/n8n-nodes-pocketbase) ([npm](https://www.npmjs.com/package/n8n-nodes-pocketbase)) instead.

This package was a fork of [n8n-nodes-pocketbase](https://github.com/TheFehr/n8n-nodes-pocketbase) that ran every operation as a PocketBase superuser. The original package now does that too, and covers everything this fork offered and more: collection and field dropdowns, file uploads, a realtime trigger, use as an AI agent tool, and an automated test suite. There's no longer a reason to maintain a separate fork.

## Migrating

1. Install `n8n-nodes-pocketbase` following the [n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/). Both packages can be installed side by side while you migrate.
2. Create a **PocketBase HTTP API** credential with the URL, email and password of your PocketBase superuser.
3. Replace each **PocketBase Admin** node with a **Pocketbase HTTP** node, using the tables below.
4. Uninstall `n8n-nodes-pocketbase-admin`.

The new node uses the operation names from the [PocketBase API docs](https://pocketbase.io/docs/api-records/) rather than the JS SDK method names:

| This package (Action) | n8n-nodes-pocketbase (Operation) |
|---|---|
| Get One | View |
| Get List | List/Search |
| Get Full List | List/Search with **All Elements** enabled |
| Get First List Item | List/Search with a **Filter** and **Elements per Page** = 1 |
| Create | Create |
| Update | Update |
| Delete | Delete |

| This package (field) | n8n-nodes-pocketbase (field) |
|---|---|
| Collection | Collection Name or ID |
| Actions | Operation |
| Record ID | Element Name or ID |
| Parameters → Expand | Parameters → Expand Relations |
| Parameters → Fields | Parameters → Field Names |
| Body Parameters | Fields (with Body Type = Fields) |

Differences to watch for:

- **Collection** can't be set with an expression; pick it from the list.
- **Get First List Item** returned an error when nothing matched. List/Search returns no items instead.
- **Get List** added a `_meta` object with the pagination totals to each record. The new node returns just the records.

## Compatibility

The last version, 3.0.0, works with PocketBase 0.23.0 or later. For PocketBase 0.22 or older, use version 1.0.0.

## License

[MIT](LICENSE.md)
