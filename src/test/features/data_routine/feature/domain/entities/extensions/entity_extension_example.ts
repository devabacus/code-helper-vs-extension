export const entityExtensionCategoryExample = `
import '../../entities/category/category.dart';
import '../../../data/models/category/category_model.dart';

extension CategoryEntityExtension on CategoryEntity {
  CategoryModel toModel() => CategoryModel(id: id, title: title);
}

extension CategoryEntityListExtension on List<CategoryEntity> {
  List<CategoryModel> toModels() => map((entity) => entity.toModel()).toList();
}   
  
`;