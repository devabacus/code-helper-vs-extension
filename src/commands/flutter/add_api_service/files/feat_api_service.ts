export const feat_api_service = (servName: string, fileName: string) => {

return `
import 'package:chopper/chopper.dart';

part '${fileName}.chopper.dart';

@ChopperApi()
abstract class ${servName} extends ChopperService {
  

  static ${servName} create([ChopperClient? client]) => _$${servName}(client);
    
  //TODO create service methods
}

`;};