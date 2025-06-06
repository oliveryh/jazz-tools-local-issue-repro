import { Account, CoList, CoMap, Group, Profile, coField } from "jazz-tools";

export class ToDoItem extends CoMap {
  name = coField.string;
  completed = coField.boolean;
  stringAttributeOne = coField.string;
  stringAttributeTwo = coField.string;
  stringAttributeThree = coField.string;
  stringAttributeFour = coField.string;
  stringAttributeFive = coField.string;
}

export class ToDoList extends CoList.Of(coField.ref(ToDoItem)) {}

export class Folder extends CoMap {
  name = coField.string;
  items = coField.ref(ToDoList);
}

export class FolderList extends CoList.Of(coField.ref(Folder)) {}

export class ToDoAccountRoot extends CoMap {
  folders = coField.ref(FolderList);
}

export class ToDoAccount extends Account {
  profile = coField.ref(Profile);
  root = coField.ref(ToDoAccountRoot);

  migrate() {
    if (!this._refs.root) {
      const group = Group.create({ owner: this });
      // Migrate with 500 items
      const exampleTodos = Array.from({ length: 500 }, (_, i) =>
        ToDoItem.create({
          name: `Example Todo ${i + 1}`,
          completed: false,
          stringAttributeOne: `String Attribute One ${i + 1}`,
          stringAttributeTwo: `String Attribute Two ${i + 1}`,
          stringAttributeThree: `String Attribute Three ${i + 1}`,
          stringAttributeFour: `String Attribute Four ${i + 1}`,
          stringAttributeFive: `String Attribute Five ${i + 1}`,
        }, { owner: group }),
      );

      const defaultFolder = Folder.create(
        {
          name: "Default",
          items: ToDoList.create(exampleTodos, { owner: group }),
        },
        { owner: group },
      );

      this.root = ToDoAccountRoot.create(
        {
          folders: FolderList.create([defaultFolder], {
            owner: this,
          }),
        },
        { owner: this },
      );
    }
  }
}
