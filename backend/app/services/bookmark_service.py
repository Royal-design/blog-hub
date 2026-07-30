from math import ceil
from uuid import UUID

from app.core.exceptions import AppException
from app.models.bookmark import Bookmark
from app.repositories.bookmark_repository import BookmarkRepository
from app.schemas.user import PaginationMeta
from app.services.post_service import PostService


class BookmarkService:
    def __init__(
        self,
        bookmark_repository: BookmarkRepository,
        post_service: PostService,
    ):
        self.bookmark_repository = bookmark_repository
        self.post_service = post_service

    def get_my_bookmarks(self, user_id: UUID, page: int = 1, page_size: int = 10):
        bookmarks, total = self.bookmark_repository.get_bookmarks_by_user_id(user_id, page, page_size)
        total_pages = ceil(total / page_size) if page_size else 0
        return {
            "data": bookmarks,
            "meta": PaginationMeta(
                total=total, page=page, page_size=page_size, total_pages=total_pages
            ).model_dump(),
        }

    def bookmark_post(self, user_id: UUID, post_id: UUID):
        self.post_service.get_post_by_id(post_id)

        existing = self.bookmark_repository.get_bookmark(user_id, post_id)
        if existing:
            raise AppException(message="Post already bookmarked", status_code=400)

        return self.bookmark_repository.create_bookmark(
            Bookmark(user_id=user_id, post_id=post_id)
        )

    def remove_bookmark(self, user_id: UUID, post_id: UUID):
        bookmark = self.bookmark_repository.get_bookmark(user_id, post_id)

        if not bookmark:
            raise AppException(message="Bookmark not found", status_code=404)

        return self.bookmark_repository.delete_bookmark(bookmark)
