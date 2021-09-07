import j2jPkg from 'awesome-json2json';
import { format, toDate, parseISO } from 'date-fns/fp/index.js';
import { compareAsc } from 'date-fns';
import { uid } from 'uid';

const { default: json2json } = j2jPkg;

const oneTabTemplate = {
  title: (root) =>
    `One Tab | ${format('PPpp', toDate(root.createDate))} | ${root.id}`,
  type: () => 'window',
  createdAt: {
    $path: 'createDate',
    $formatting: (dateString) => toDate(dateString),
  },
  links: {
    connectOrCreate: {
      $path: 'tabsMeta[]',
      where: {
        url: 'url',
      },
      create: {
        url: 'url',
        title: 'title',
        createdAt: {
          $path: '$root.createDate',
          $formatting: (dateString) => toDate(dateString),
        },
      },
    },
  },
};

const sessionsTemplate = {
  title: (root) =>
    `Sessions | ${format('PPpp', parseISO(root.created))} | ${root.id}`,
  type: () => 'window',
  createdAt: {
    $path: 'created',
    $formatting: (dateString) => parseISO(dateString),
  },
  links: {
    connectOrCreate: {
      $path: 'tabs[]',
      where: {
        url: 'url',
      },
      create: {
        url: 'url',
        title: {
          $path: 'title',
          $formatting: (value, { $item }) => value ?? $item.url,
        },
        incognito: 'incognito',
        createdAt: {
          $path: '$root.created',
          $formatting: (dateString) => parseISO(dateString),
        },
      },
    },
  },
};

const clusterTemplate = {
  title: (root) =>
    `Cluster | ${format('PPpp', toDate(root.lastModified))} | ${root.id}`,
  type: () => 'window',
  createdAt: {
    $path: 'lastModified',
    $formatting: (dateString) => toDate(dateString),
  },
  links: {
    connectOrCreate: {
      $path: 'tabs[]',
      where: {
        url: 'url',
      },
      create: {
        url: 'url',
        title: 'title',
        createdAt: {
          $path: '$root.lastModified',
          $formatting: (dateString) => toDate(dateString),
        },
      },
    },
  },
};

export function cluster(rawCluster) {
  return Object.values(rawCluster.win)
    .map((window) => json2json(window, clusterTemplate))
    .sort((a, b) => compareAsc(a.createdAt, b.createdAt));
}

export function oneTab(rawOneTab) {
  return rawOneTab.tabGroups
    .map((window) => json2json(window, oneTabTemplate))
    .sort((a, b) => compareAsc(a.createdAt, b.createdAt));
}

export function sessions(rawSessions) {
  return rawSessions.sessions
    .reduce(
      (acc, curr) =>
        acc.concat(
          curr.windows.map((x) => ({
            ...x,
            created: curr.created,
            id: `${curr.gid} | ${x.id} | ${uid()}`,
          }))
        ),
      []
    )
    .map((window) => json2json(window, sessionsTemplate))
    .sort((a, b) => compareAsc(a.createdAt, b.createdAt));
}
