# jazz-tools-local-issue-repro

Originally raised in the Jazz tools Discord server: [message](https://discord.com/channels/1139617727565271160/1139621689882321009/1366010788426420244)

> Hello, I've enjoyed trying out Jazz.tools in vue recently. I wanted to sense check my understanding of the local-first component of it. If I subscribe to a CoValue (in this instance, a CoList of 100 CoMaps, using useCoState) and tried my best to deeply load it using { resolve: { $each: { true }}, on revisiting the page, should I expect a local version of this to be rendered first, before being synced? What I'm finding is that ~100 websocket messages are being sent/received before anything is rendered, which can take ~3 seconds or so.
>
> I've noticed that the Jazz Inspector does roughly what I'm trying to achieve, where if I hard refresh when inspecting a CoList, the UI is rendered near instantly. The websocket messages appear to batch up the load actions in groups of 10, as opposed to sending ~1 message per CoMap in the CoList, which appears to be snappier, but it may be a red herring.

## Reproduction Steps

1. Clone the repository, install dependencies, and start the development server.
2. Navigate to the app and create a new user.
3. Click on the "Default" folder and see 500 items be rendered.
4. Revisit the page.
5. Observe that a large amount of websocket messages are sent before the UI is rendered.

## Expected Behavior

I wanted to try to improve the load time when revisiting the page, I was hoping to see one of the following behaviours:

- A local version of the CoList being rendered first, before the websocket messages are sent/processed.
- Websocket messages being batched up. If we do need to send websocket messages before rendering, the behviour I could observe in the Jazz Inspector, where messages are sent in batches of 10, would be preferable to sending one message per item in the CoList.

## What I've Tried

I've tried to follow some of the suggestions in the docs around deep loading.

With the batching mechanism, I've taken a closer look at the [`BatchedOutgoingMessages.ts`](https://github.com/garden-co/jazz/blob/c018752c0c452fd21b18b6513b15b81dcdc615dd/packages/cojson-transport-ws/src/BatchedOutgoingMessages.ts) to better understand if there is already a mechanism that would help here that I'm somehow not using.

My only observation there is that the `sendMessagesInBulk` callback may be getting called too frequently, so the backlog of messages are individually being sent. After digging into that file for an hour or so, I thought it was about time to ask for help.
