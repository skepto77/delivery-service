import Advertisement from '../models/Advertisement.js';

const getAdvertisements = async (req, res) => {
  const { shortText, description, userId, tags } = req.params;
  try {
    const advertisements = await Advertisement.find();
    res.status(200).json(advertisements);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: `err` });
  }
};

const getAdvertisementById = async (req, res) => {
  const { id } = req.params;
  try {
    const advertisement = await Advertisement.findById(id);
    res.status(200).json(advertisement);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: `Объявление не найдено` });
  }
};

const addAdvertisement = async (req, res) => {
  const { shortText, description, images, userId, createdAt, updatedAt, tags, isDeleted } =
    req.body;

  try {
    const advertisement = await Advertisement.create({
      shortText,
      description,
      images,
      userId: req.user,
      createdAt,
      updatedAt,
      tags,
      isDeleted,
    });
    res.status(201).json(advertisement);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Ошибка добавления объявления` });
  }
};

const removeAdvertisementById = async (req, res) => {
  const { id } = req.params;

  if (req.isAuthenticated()) {
    try {
      const advertisement = await Advertisement.findById(id);
      if (advertisement.userId !== req.user) {
        return res.status(403).json({ message: `Не достаточно прав для удаления` });
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: `Объявление не найдено` });
    }
  }

  try {
    await Advertisement.deleteOne({ _id: id });
    res.status(200).json({ message: `Объявление удалено` });
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: `Ошибка удаления объявления` });
  }
};

export { getAdvertisements, getAdvertisementById, addAdvertisement, removeAdvertisementById };
