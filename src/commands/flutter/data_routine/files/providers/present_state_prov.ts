import path from "path";
import { cap, pluralConvert } from "../../../../../utils/text_work/text_util";


export const presentProvFoldPath = (fPath: string, driftClassName: string) => path.join(fPath, "presentation", "providers", `${driftClassName}`);

export const presentProvPath = (presFoldPath: string, driftClassName: string) => path.join(presFoldPath, `${driftClassName}_state_providers.dart`);

export const presentStateProvCont = (driftClassName: string)=> {
    const d = driftClassName;
    const D = cap(driftClassName);
    const Ds = pluralConvert(D);
    
return `
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${d}.dart';
import '../../../domain/providers/${d}_usecase_providers.dart';

part '${d}_state_providers.g.dart';

@riverpod
class ${Ds} extends _$${Ds} {
  @override
  Future<List<${D}Entity>> build() {
    return ref.read(get${Ds}UseCaseProvider)();
  }

  Future<void> add${D}(${D}Entity ${d}) async {
    state = await AsyncValue.guard(() async {
      await ref.read(create${D}UseCaseProvider)(${d});
      return ref.read(get${Ds}UseCaseProvider)();
    });
  }

  Future<void> update${D}(${D}Entity ${d}) async {
    state = await AsyncValue.guard(() async {
      await ref.read(update${D}UseCaseProvider)(${d});
      return ref.read(get${Ds}UseCaseProvider)();
    });
  }

  Future<void> delete${D}(int id) async {
    state = await AsyncValue.guard(() async {
      await ref.read(delete${D}UseCaseProvider)(id);
      return ref.read(get${Ds}UseCaseProvider)();
    });
  }
}
`;};
